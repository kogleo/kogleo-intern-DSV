import { useSelector, useDispatch } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography, Avatar, Chip, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavouriteBtn from "../FavouriteBtn";
import HomeFollowBtn from './HomeFollowBtn'
import ReadMore from '../ReadMore';
import { favouriteArticle, unfavouriteArticle } from "../../redux/actions/articleActions";
import { useNavigate} from 'react-router-dom'
import Moment from 'react-moment';

export default function NewArticlePreview(props){
    const {article} = props
    const [isFavourite, setIsFavourite] = useState(false)
    const [loadFavourite, setLoadFavourite] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth, socket} = useSelector(state => state)

    useEffect(() => {
        if (article){
            if(article.favourites.find(favor=> favor?._id === auth.user?._id)){
                setIsFavourite(true)
            }else{
                setIsFavourite(false)
            }
        }
    }, [article, auth.user])


    const handleFavourite = async () => {
        if(loadFavourite) return;
        setLoadFavourite(true)
        if (!auth.user){
            return navigate('/login')
        }
        await dispatch(favouriteArticle({article, auth, socket}))
        setLoadFavourite(false)
    }

    const handleUnFavourite = async () => {
        if(loadFavourite) return;
        setLoadFavourite(true)
        if (!auth.user){
            return navigate('/login')
        }
        await dispatch(unfavouriteArticle({article, auth, socket}))
        setLoadFavourite(false)
    }

    return (
        <div className="article-preview">
            <Box sx={{ flexGrow: 1 }} 
            style={{border: '1px solid #ccc', borderRadius: '10px', backgroundColor: 'white'}}>
                <Grid container spacing={1} marginBottom={1}>
                    <Grid item xs={12} className='top-article' marginTop={1} marginLeft={1}>
                        <Grid container columnSpacing={1} align='left' direction={'row'}>
                            <Grid item xs={1}>
                                <Avatar alt={article.author.username} src={article.author.image} 
                                component={Link} to={`/profile/${article.author.username}`}/>
                            </Grid>
                            <Grid item container xs={'auto'} direction="column" justifyContent="center" className='author'>
                                <Typography variant="body1" style={{textDecoration: 'none', color: 'inherit'}}
                                component={Link} to={`/profile/${article.author.username}`}>
                                    <b>{article.author.username}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} align='left' alignItems="center" container>
                                { article.author?._id !== auth.user?._id &&  <HomeFollowBtn user={article.author}/>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <img src={article.image} alt={article.title} style={{width: '100%', maxHeight: '100%'}}/>
                    </Grid>
                    <Grid item xs={12} align='left' className="btn-container">
                        <Grid container columnSpacing={0}>
                            <Grid item xs={1}>
                                <FavouriteBtn isFavourite={isFavourite} 
                                handleFavourite={handleFavourite} 
                                handleUnFavourite={handleUnFavourite}/>
                            </Grid>
                            <Grid item xs={1}>
                            <Link to={`/article/${article.slug}`} key={article.slug} style={{textDecoration: 'none'}}>
                                <IconButton>
                                    <ChatBubbleOutlineIcon style={{color: 'rgb(38, 38, 38)'}}/>
                                </IconButton>
                            </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} marginLeft={1}>
                            <Typography variant='body1'><b>{article.favourites ? article.favourites.length : '' } Favourites</b></Typography>
                    </Grid>
                    <Grid item xs={12} marginLeft={1}>
                        <b>{article.author.username}</b> <Typography variant='body1' display='inline-block'>{article ? article.title : '' }</Typography>
                    </Grid>
                    <Grid item xs={12} marginLeft={1.5} marginRight={1.5}>
                        {article.description.length > 200 ? 
                        <ReadMore>{article.description}</ReadMore> 
                        :
                        article.description
                        }
                        
                    </Grid>
                    <Grid item xs={12} marginLeft={1}>
                        <Link to={`/article/${article.slug}`} style={{textDecoration: 'none'}}>
                            {article.comments.length > 0 && 
                            <Typography variant='body1' style={{color: 'gray'}}>
                                View all {article.comments.length} comments
                            </Typography>}
                        </Link>
                    </Grid>
                    <Grid item xs={12} marginRight={0}>
                        <Grid container columnSpacing={0}>
                            <Grid item xs={3}  marginLeft={1}>
                                <Typography variant='caption' style={{color: '#ccc'}}>
                                    <Moment fromNow>{article.createdAt}</Moment>
                                </Typography>
                            </Grid>
                            <Grid item xs={8} align="right">
                                {article.taglist.map((tag, index) => (
                                    <Chip key={index} label={tag} style={{marginLeft: '5px'}}/>
                                ))}
                            </Grid> 
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}