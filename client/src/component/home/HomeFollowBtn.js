import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { follow, unfollow } from '../../redux/actions/profileAction'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HomeFollowBtn = ({user}) => {
    const [followed, setFollowed] = useState(false)

    const { auth, profile, socket} = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(auth.user?.following.find(item => item._id === user._id)){
            setFollowed(true)
        }
        return () => setFollowed(false)
    }, [auth.token, auth.user, user._id])

    const handleFollow =  async () => {
        if(load) return;
        if (!auth.user){
            return navigate('/login')
        }
        setFollowed(true)
        setLoad(true)
        await dispatch(follow({users: profile.users, user, auth, socket}))
        setLoad(false)
    }

    const handleUnFollow = async () => {
        if(load) return;

        setFollowed(false)
        setLoad(true)
        await dispatch(unfollow({users: profile.users, user, auth, socket}))
        setLoad(false)
    }

    return (
        <>
        {
            followed
            ? 
                <>
                    <Typography onClick={handleUnFollow} style={{color: 'black', cursor: 'pointer'}}>
                        <b>•&nbsp;</b><b style={{color: 'black'}}>Following</b>
                    </Typography> 
                </>
            :   
                <>
                    <Typography onClick={handleFollow}  style={{color: 'black', cursor: 'pointer'}}>
                        <b>•&nbsp;</b><b style={{color: '#77A7FF'}}>Follow</b>
                    </Typography> 
                </>
        }
        </>
    )
}

export default HomeFollowBtn

