import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { follow, unfollow } from '../redux/actions/profileAction'
import { Button } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const FollowBtn = ({user}) => {
    const [followed, setFollowed] = useState(false)

    const { auth, profile, socket} = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(auth.user.following.find(item => item._id === user._id)){
            setFollowed(true)
        }
        return () => setFollowed(false)
    }, [auth.user.following, user._id])

    const handleFollow =  async () => {
        if(load) return;

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
            ? <Button className="follow-btn" variant="outlined" color="error"
            onClick={handleUnFollow}>
                <RemoveIcon/>
                &nbsp;
                UnFollow &nbsp; 
            </Button>
            : <Button className="follow-btn" variant="outlined" color="success"
            onClick={handleFollow}>
                <AddIcon/>
                &nbsp;
                Follow &nbsp;
            </Button>
        }
        </>
    )
}

export default FollowBtn
