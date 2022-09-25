import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import { IconButton } from '@mui/material';

const FavouriteBtn = ({isFavourite, handleFavourite, handleUnFavourite}) => {

    return (
        <>
            {
                isFavourite
                ? <IconButton className="unfavour-btn" onClick={handleUnFavourite}> 
                    <FavoriteIcon style={{color: 'rgb(237, 73, 86)'}}/>
                </IconButton>
                : 
                <IconButton className="favour-btn" onClick={handleFavourite}> 
                    <FavoriteBorderIcon style={{color: 'rgb(38, 38, 38)'}}/>
                </IconButton>
            }
        </>
    )
}

export default FavouriteBtn