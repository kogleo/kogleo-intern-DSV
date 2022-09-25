import React, { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { favouriteArticle, unfavouriteArticle} from "../redux/actions/articleActions";
import { ARTICLE_TYPES } from "../redux/actions/articleActions";

import {Container, Typography, Grid, Avatar, IconButton} from "@mui/material";
import FavouriteBtn from "./FavouriteBtn";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Moment from 'react-moment';

import HomeFollowBtn from "./home/HomeFollowBtn";
import CommentInput from "./article/CommentInput";
import ReadMore from "./ReadMore";

import Comments from './Comments'
import '../component/article/articleDetail.css'

export default function NewArticleDetail(props){
    const {article, auth} = props
    const [isFavourite, setIsFavourite] = useState(false)
    const [loadFavourite, setLoadFavourite] = useState(false)
    // const [openPopup, setOpenPopup] = useState(false)
    const { socket} = useSelector(state=>state)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        document.title=`${article?.author.username} on Kogleo: "${article?.title}"`
    }, [article])

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

    const handleOpenPopup = () => {
        dispatch({type: ARTICLE_TYPES.OPEN_POPUP_ARTICLE, payload: {...article, openPopupArticle: true}})
    }
    return(
        <div>
        {(article && auth) ?
        <>
            <div className="article-detail" style={{marginTop: '5vh', zIndex: '1', position: 'relative'}}>
                <Container className="article" maxWidth={"lg"} style={{boxSizing: 'border-box'}}>
                    <Grid container direction='row'
                    style={{boxSizing: 'border-box', maxHeight: '85vh', borderRadius: '1px', backgroundColor: 'white'}}>
                        <Grid item xs={12} md={6} lg={7} style={{maxHeight: '85vh', border: '1px solid #ccc'}} >
                            <Grid container justifyContent={"center"} alignItems={"center"} style={{maxHeight: '85vh'}}>
                                <img alt={article?.title} src={article ? article.image : ''} style={{height: '85vh', width: '100%'}}/>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5} className="right-side" style={{ maxHeight: '85vh', border: '1px solid #ccc'}}>
                            <Grid container rowSpacing={0} style={{height: "85vh"}}
                                direction='row' alignContent="space-between">
                                <Grid item xs={12} className="top-content">
                                    <Grid alignItems='center' container item xs={12} className='top-article' paddingTop={1} paddingBottom={1}  style={{borderBottom: '1px solid #ccc'}}>  
                                        <Grid item xs={9}>
                                            <Grid container columnSpacing={1} alignItems='flex-start'>  
                                                <Grid item xs={'auto'} marginLeft={1}>
                                                    <Avatar alt={article.author ? article.author.username : ''} src={article.author ? article.author.image : ''}/>
                                                </Grid>
                                                <Grid item container xs={'auto'} direction="column" justifyContent="center" className='author'>
                                                    <Link to={`/profile/${article.author?.username}`} style={{textDecoration: "none", color: "black"}}>
                                                        <Typography component={'span'}><b>{article.author ? article.author?.username : ''}</b></Typography>
                                                    </Link>
                                                    <Typography variant='caption' style={{color: '#ccc'}}>
                                                        <Moment fromNow>{article.createdAt}</Moment>
                                                    </Typography>
                                                </Grid>
                                                {<Grid item xs={2} alignItems="flex-start" className='detail-follow-btn' container>
                                                    { article.author?._id !== auth.user?._id &&  <HomeFollowBtn user={article.author}/>}
                                                </Grid>}
                                            </Grid>  
                                        </Grid>
                                        <Grid container xs={2} direction="row" justifyContent="flex-end" alignItems="flex-end" className='delete'>
                                            {(auth.user?._id === article.author?._id) && <MoreHorizIcon onClick={handleOpenPopup} style={{cursor: "pointer"}}/>}
                                        </Grid>
                                    </Grid>
                                    
                                    <Grid item xs={12} className="body" marginTop={1} > 
                                        <Grid container rowSpacing={2}>
                                            <Grid item xs={12}  marginLeft={2}> 
                                                <Typography variant="h4">
                                                    {article.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={10}  marginLeft={3}> 
                                                <Typography variant="subtitle1">
                                                    <i>"{article.description}"</i>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={10}  marginLeft={3}> 
                                            {
                                                article.body.length > 200
                                                ?
                                                <ReadMore>
                                                    {article.body}
                                                </ReadMore>
                                                :
                                                article.body
                                            }
                                                
                                                
                                            </Grid>
                                        </Grid>
                                    
                                    <Grid item xs={12} className='button' alignItems='flex-start' style={{borderBottom: '1px solid #ccc'}}>
                                        <Grid container columnSpacing={{xs: 2, md: 1}}>
                                            <Grid item xs={1} md={1}>
                                                <FavouriteBtn isFavourite={isFavourite} 
                                                handleFavourite={handleFavourite} 
                                                handleUnFavourite={handleUnFavourite}/>
                                            </Grid>
                                            <Grid item xs={1} md={1}>
                                                <IconButton>
                                                    <ChatBubbleOutlineIcon style={{color: 'rgb(38, 38, 38)'}}/>
                                                </IconButton>
                                            </Grid>
                                            <Grid item xs={12}  marginLeft={1}>
                                                <Typography variant='body2'><b>{article.favourites ? article.favourites.length : '' } Favourites</b></Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                
                                    <Grid item xs={12} className='comment' style={{height: "25h", maxHeight: '45vh'}} marginLeft={1}>
                                        {/* <Grid marginLeft={1} style={{height: '45vh'}}> */}
                                            <Comments article = {article} />
                                        {/* </Grid> */}
                                    </Grid>
                                    </Grid>
                                </Grid>
                                    
                                <Grid item xs={12} marginLeft={1}>
                                    <CommentInput article={article}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </div>
            </>
            :
            <>
            </>
        
        }
        </div>
    )
}