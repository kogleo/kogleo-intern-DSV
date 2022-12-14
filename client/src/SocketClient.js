import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {ARTICLE_TYPES} from './redux/actions/articleActions'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import { NOTIFY_TYPES } from './redux/actions/notifyAction'
// import { MESS_TYPES } from './redux/actions/messageAction'

import audiobell from '../src/assets/audio/got-it-done-613.mp3'


const spawnNotification = (body, icon, url, title) => {
    let options = {
        body, icon
    }
    let n = new Notification(title, options)

    n.onclick = e => {
        e.preventDefault()
        window.open(url, '_blank')
    }
}

const SocketClient = () => {
    const { auth, socket, notify} = useSelector(state => state)
    const dispatch = useDispatch()

    const audioRef = useRef()

    // joinUser
    useEffect(() => {
        socket.emit('joinUser', auth.user)
    },[socket, auth.user])

    // Likes
    useEffect(() => {
        socket.on('favouriteToClient', newArticle =>{
            dispatch({type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle})
        })

        return () => socket.off('favouriteToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('unfavouriteToClient', newArticle =>{
            dispatch({type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle})
        })

        return () => socket.off('unfavouriteToClient')
    },[socket, dispatch])


    // Comments
    useEffect(() => {
        socket.on('createCommentToClient', newArticle =>{
            dispatch({type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle})
        })

        return () => socket.off('createCommentToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('deleteCommentToClient', newArticle =>{
            dispatch({type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle})
        })

        return () => socket.off('deleteCommentToClient')
    },[socket, dispatch])


    // Follow
    useEffect(() => {
        socket.on('followToClient', newUser =>{
            dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})
        })
        return () => socket.off('followToClient')
    },[socket, dispatch, auth])

    useEffect(() => {
        socket.on('unFollowToClient', newUser =>{
            dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})
        })

        return () => socket.off('unFollowToClient')
    },[socket, dispatch, auth])


    // Notification
    useEffect(() => {
        socket.on('createNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})
            if(notify.sound) audioRef.current.play()
            spawnNotification(
                msg.user.username + ' ' + msg.text,
                msg.user.avatar,
                msg.url,
                'KOGLEO'
            )
        })

        return () => socket.off('createNotifyToClient')
    },[socket, dispatch, notify.sound])

    useEffect(() => {
        socket.on('removeNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
        })

        return () => socket.off('removeNotifyToClient')
    },[socket, dispatch])


    // Message
    // useEffect(() => {
    //     socket.on('addMessageToClient', msg =>{
    //         dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})

    //         dispatch({
    //             type: MESS_TYPES.ADD_USER, 
    //             payload: {
    //                 ...msg.user, 
    //                 text: msg.text, 
    //                 media: msg.media
    //             }
    //         })
    //     })

    //     return () => socket.off('addMessageToClient')
    // },[socket, dispatch])

    // Check User Online / Offline
    // useEffect(() => {
    //     socket.emit('checkUserOnline', auth.user)
    // },[socket, auth.user])

    // useEffect(() => {
    //     socket.on('checkUserOnlineToMe', data =>{
    //         data.forEach(item => {
    //             if(!online.includes(item.id)){
    //                 dispatch({type: GLOBALTYPES.ONLINE, payload: item.id})
    //             }
    //         })
    //     })

    //     return () => socket.off('checkUserOnlineToMe')
    // },[socket, dispatch, online])

    // useEffect(() => {
    //     socket.on('checkUserOnlineToClient', id =>{
    //         if(!online.includes(id)){
    //             dispatch({type: GLOBALTYPES.ONLINE, payload: id})
    //         }
    //     })

    //     return () => socket.off('checkUserOnlineToClient')
    // },[socket, dispatch, online])

    // Check User Offline
    // useEffect(() => {
    //     socket.on('CheckUserOffline', id =>{
    //         dispatch({type: GLOBALTYPES.OFFLINE, payload: id})
    //     })

    //     return () => socket.off('CheckUserOffline')
    // },[socket, dispatch])


    // Call User
    // useEffect(() => {
    //     socket.on('callUserToClient', data =>{
    //         dispatch({type: GLOBALTYPES.CALL, payload: data})
    //     })

    //     return () => socket.off('callUserToClient')
    // },[socket, dispatch])

    // useEffect(() => {
    //     socket.on('userBusy', data =>{
    //         dispatch({type: GLOBALTYPES.ALERT, payload: {error: `${call.username} is busy!`}})
    //     })

    //     return () => socket.off('userBusy')
    // },[socket, dispatch, call])



    return (
        <>
            <audio controls ref={audioRef} style={{display: 'none'}} >
                <source src={audiobell} type="audio/mp3" />
            </audio>
        </>
    )
}

export default SocketClient
