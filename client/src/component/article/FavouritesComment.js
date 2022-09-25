import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import {  IconButton } from '@mui/material';
import { favouriteComment, unFavouriteComment } from '../../redux/actions/commentActions';

export default function FavorCmtBtn({comment, auth, article}){
    const [isFavouriteCmt, setIsFavouriteCmt] = useState(false)
    const [loadFavourite, setLoadFavourite] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        if (comment){
            if(comment.likes.find(favor=> favor._id === auth.user?._id)){
                setIsFavouriteCmt(true)
            }else{
                setIsFavouriteCmt(false)
            }
        }
        
    }, [comment,  auth.user])

    const handleFavourite = async () => {
        if(loadFavourite) return;
        
        setLoadFavourite(true)
        await dispatch(favouriteComment({article, auth, comment}))
        setLoadFavourite(false)
    }

    const handleUnFavourite = async () => {
        if(loadFavourite) return;
        setLoadFavourite(true)
        await dispatch(unFavouriteComment({article, auth, comment}))
        setLoadFavourite(false)
    }

    return (
        <>
            {
                isFavouriteCmt
                ? <IconButton className="unfavour-btn" onClick={handleUnFavourite} style={{padding: 0}}> 
                    <FavoriteIcon style={{color: 'rgb(237, 73, 86)', fontSize: '1rem'}}/>
                </IconButton>
                : 
                <IconButton className="favour-btn" onClick={handleFavourite} style={{padding: 0}}> 
                    <FavoriteBorderIcon style={{color: 'rgb(38, 38, 38)', fontSize: '1rem'}}/>
                </IconButton>
            }
        </>
    )
}