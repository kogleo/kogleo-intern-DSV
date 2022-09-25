import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { follow, unfollow } from '../../redux/actions/profileAction'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ProfileFollowBtn = ({user, page}) => {
    const [followed, setFollowed] = useState(false)

    const { auth, profile, socket} = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(auth.user?.following.find(item => item._id === user?._id)){
            setFollowed(true)
        }
        return () => setFollowed(false)
    }, [auth.user?.following, user?._id])

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
            followed === true
            ? 
                <>
                    <Button onClick={handleUnFollow}
                        style={{textTransform: 'none', color: 'black', border: '1px solid #ccc'}}
                        size = {page === "profile"  ? "small" : "medium"}
                        variant="outlined">
                            Following   
                    </Button>
                </>
            :   
                <>
                    <Button onClick={handleFollow}
                        style={{textTransform: 'none', backgroundColor: 'rgb(0,149,246)'}}
                        size = {page === "profile"  ? "small" : "medium"}
                        variant="contained">
                            Follow   
                    </Button>
                </>
        }
        </>
    )
}

export default ProfileFollowBtn
