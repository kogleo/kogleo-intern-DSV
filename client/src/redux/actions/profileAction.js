import { GLOBALTYPES, DeleteData } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from '../actions/notifyAction'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_USERNAME: 'GET_USERNAME',
    GET_ARTICLES: 'GET_PROFILE_ARTICLES',
    UPDATE_ARTICLE: 'UPDATE_PROFILE_ARTICLE',
    GET_FAVOURITED_ARTICLES: 'GET_FAVOURITED_ARTICLES',
    OPEN_USER_CARD: 'OPEN_USER_CARD'
}

export const getProfileUsers = ({usernameLink, auth}) => async (dispatch) => {
    dispatch({type: PROFILE_TYPES.GET_USERNAME, payload: usernameLink})

    try {
        
        dispatch({type: PROFILE_TYPES.LOADING, payload: true})
        const res = getDataAPI(`user/${usernameLink}`)
        const res1 = getDataAPI(`articles/?author=${usernameLink}`, auth.token)
        const res2 = getDataAPI(`articles/?favourited=${usernameLink}`, auth.token)
        const users = await res;
        const articles = await res1;
        const fav_articles = await res2;
        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: users.data
        })
        dispatch({
            type: PROFILE_TYPES.GET_ARTICLES,
            payload: {...articles.data, username: usernameLink, page: 2}
        })
        dispatch({
            type: PROFILE_TYPES.GET_FAVOURITED_ARTICLES,
            payload: {...fav_articles.data, username: usernameLink}
        })

        dispatch({type: PROFILE_TYPES.LOADING, payload: false})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
    
}


export const updateProfileUser = ({userDatas, auth, socket}) => async (dispatch) => {
    console.log(userDatas.password)
    if(!userDatas.username)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Please add your username."}})

    if(userDatas.username.length > 25)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Your username too long."}})

    if(userDatas.bio && userDatas.bio.length > 200)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Your description too long."}})

    try {
        // let media;
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        const res = await patchDataAPI("user", {
            ...userDatas
        }, auth.token)  

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user, ...userDatas
                }
            }
        })

        dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}})

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const follow = ({users, user, auth, socket}) => async (dispatch) => {
    let newUser;
    
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: [...user.followers, auth.user]}
    }else{
        const data = users.filter(item => item._id === user._id)
        if (data[0]){
            newUser = {...data[0], followers: [...data[0].followers, auth.user]}
        }

        // users.forEach(item => {
        //     if(item._id === user._id){
        //         console.log(item.followers)
        //         newUser = {...item, followers: [...item.followers, auth.user]}
        //         console.log(newUser)
        //     }
        // })
        
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: {...auth.user, following: [...auth.user.following, newUser]}
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token)
        socket.emit('follow', res.data.newUser)
        
        // // Notify
        const msg = {
            id: auth.user._id,
            text: "has started to follow you.",
            recipients: [newUser._id],
            url: `/profile/${auth.user.username}`,
            content: '', 
            image: auth.user.image,
            avatar: newUser.image
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}

export const unfollow = ({users, user, auth, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: DeleteData(user.followers, auth.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: DeleteData(item.followers, auth.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: { 
                ...auth.user, 
                following: DeleteData(auth.user.following, newUser._id) 
            }
        }
    })
   

    try {
        const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)
        socket.emit('unFollow', res.data.newUser)

        // Notify
        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user.username}`,
        }

        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}