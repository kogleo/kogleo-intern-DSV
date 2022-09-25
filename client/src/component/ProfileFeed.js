import React from 'react'
import { Link } from "react-router-dom";
import { 
    Box,
    Typography, 
    Grid, 
    IconButton, 
    ImageList, 
    ImageListItem,
    ImageListItemBar, 
    } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import '../assets/css/profile/profileFeed.css'

export default function ProfileFeed(props){
    const articles = props.articles

    return (
        <>
        {articles.length > 0 ?
            <ImageList cols={3}  rowHeight={300} gap={50} className='imageList-profile'
            sx={{
                width: 1, height: 1,
            }}>
                {articles.map((article) => (
                    <Link key={article.slug} to={`/article/${article.slug}`} style={{textDecoration: 'none'}}>
                    <ImageListItem key={article._id}>
                        <img
                        src={article.image}
                        srcSet={article.image}
                        alt={article.title}
                        loading="lazy"
                        style={{width: "300px", height: "300px"}}
                        />
                        <ImageListItemBar
                        sx={{width: 300, height: 1,
                            background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        }}
                        position="center"
                        actionIcon={
                            <Grid container columnSpacing={1}>
                                <Grid item xs={6} >
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        aria-label=''
                                        >
                                            <FavoriteIcon/>
                                            &nbsp;
                                            <Typography>{article.favourites.length}</Typography>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={6}>
                                    <IconButton
                                        sx={{ color: 'white' }}
                                        aria-label=''
                                        >
                                            <ModeCommentIcon/>
                                            &nbsp;
                                        <Typography>{article.comments.length}</Typography>
                                    </IconButton>
                                </Grid>
                            </Grid>
                            
                            
                        }
                        actionPosition="center"
                        />
                    </ImageListItem>
                    </Link>
                ))}
            </ImageList>
        :
            <Box marginTop={10}>
                <PhotoCameraOutlinedIcon  sx={{ fontSize: 60 }} style={{position: "relative", left: "50%", transform: "translateX(-50%)"}}/>
                <Typography variant="h3" textAlign={"center"}>No Articles Yet</Typography>
            </Box>
        }
        </>
        
    );
}