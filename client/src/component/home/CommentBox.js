import React, { useState, useEffect } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';
import { Grid, IconButton } from '@mui/material';
import FavorCmtBtn from '../article/FavouritesComment';
import { deleteComment } from '../../redux/actions/commentActions';
import { useDispatch, useSelector } from 'react-redux';
import { ARTICLE_TYPES } from '../../redux/actions/articleActions';


export default function CommentBox(props) {
    const {comments, auth, article, socket} = props
    const {feedArticle} = useSelector(state=>state)
    const [replyComments, setReplyComments] = useState([])
    const dispatch = useDispatch()
    const [isFavouriteCmt, setIsFavouriteCmt] = useState(false)
    // const [onReply, setOnReply] = useState(false)

    function handleDeleteComment(cmt){
        let comment = cmt
        dispatch(deleteComment({article, comment, auth, socket}))
    }

    function handleReply(cmt){
        if(feedArticle.onReply) {
            
            return dispatch({type: ARTICLE_TYPES.SET_ON_REPLY, payload: {...article, onReply: false}})
        }
        dispatch({type: ARTICLE_TYPES.SET_ON_REPLY, payload: {...article, onReply: cmt}})
    }

    useEffect(()=> {
        const newRep = article.comments.filter(cm => cm.reply)
        setReplyComments(newRep)
    }, [article.comments])

    return (
    <List sx={{ width: '100%', maxWidth: "100%", bgcolor: 'background.paper' }}>
        {comments.map(cmt=>(
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={cmt.user.username} src={cmt.user.image} />
                </ListItemAvatar>
                <ListItemText
                primary={
                    <React.Fragment>
                        <Grid container columnSpacing={1} style={{width: "100%"}}>
                            <Grid item xs={10}>
                                <Grid container columnSpacing={1}>
                                    <Grid item xs='auto'>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary">
                                            <b>{cmt.user.username}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {cmt.content}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            <Grid item xs={2}>
                                <Grid container justifyContent="center" alignItems="center" style={{height: '100%'}}>
                                    <FavorCmtBtn comment={cmt} auth={auth} article={article}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                    </React.Fragment>
                }
                secondary={
                    <React.Fragment>
                        <Grid container direction={'row'} columnSpacing={2}>
                            <Grid item xs='auto'>
                                <Typography variant='caption' style={{color: '#ccc'}}>
                                    {<Moment fromNow>{cmt.createdAt}</Moment>}
                                </Typography>
                            </Grid>
                            {(cmt.likes.length > 0) && 
                                <Grid item xs='auto'>
                                    <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold'}}>
                                        {cmt.likes.length} likes
                                    </Typography>
                                </Grid>
                            }
                            <Grid item xs='auto'>
                                {(feedArticle.onReply && feedArticle.onReply._id == cmt._id) ?
                                    <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}} onClick={()=>handleReply(cmt)}>
                                        Cancel
                                    </Typography>
                                    :
                                    <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}} onClick={()=>handleReply(cmt)}>
                                        Reply
                                    </Typography>
                                }
                            </Grid>
                            <Grid item xs='auto'>
                                {(auth.user._id == cmt.user._id) &&
                                    <Typography variant='caption' onClick={()=>handleDeleteComment(cmt)} style={{opacity: 0.5, color: 'rgb(237, 73, 86)', fontWeight: 'bold', cursor: 'pointer'}} >
                                        Delete
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                        <List sx={{ width: '100%', maxWidth: "100%", bgcolor: 'background.paper' }}>
                            {replyComments.filter(item => item.reply === cmt._id).map(cmt=>(
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt={cmt.user.username} src={cmt.user.image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <Grid container columnSpacing={1} style={{width: "100%"}}>
                                                <Grid item xs={10}>
                                                    <Grid container columnSpacing={1}>
                                                        <Grid item xs='auto'>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary">
                                                                <b>{cmt.user.username}</b>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={'auto'}>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                {cmt.content}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                
                                                <Grid item xs={2}>
                                                    <Grid container justifyContent="center" alignItems="center" style={{height: '100%'}}>
                                                        <FavorCmtBtn comment={cmt} auth={auth} article={article}/>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                        </React.Fragment>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Grid container direction={'row'} columnSpacing={2}>
                                                <Grid item xs='auto'>
                                                    <Typography variant='caption' style={{color: '#ccc'}}>
                                                        {<Moment fromNow>{cmt.createdAt}</Moment>}
                                                    </Typography>
                                                </Grid>
                                                {(cmt.likes.length > 0) && 
                                                    <Grid item xs='auto'>
                                                        <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold'}}>
                                                            {cmt.likes.length} likes
                                                        </Typography>
                                                    </Grid>
                                                }
                                                <Grid item xs='auto'>
                                                    {(feedArticle.onReply && feedArticle.onReply._id == cmt._id) ?
                                                        <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}} onClick={()=>handleReply(cmt)}>
                                                            Cancel
                                                        </Typography>
                                                        :
                                                        <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}} onClick={()=>handleReply(cmt)}>
                                                            Reply
                                                        </Typography>
                                                    }
                                                </Grid>
                                                <Grid item xs='auto'>
                                                    {(auth.user._id == cmt.user._id) &&
                                                        <Typography variant='caption' onClick={()=>handleDeleteComment(cmt)} style={{opacity: 0.5, color: 'rgb(237, 73, 86)', fontWeight: 'bold', cursor: 'pointer'}} >
                                                            Delete
                                                        </Typography>
                                                    }
                                                </Grid>
                                            </Grid>
                                            
                                            
                                        </React.Fragment>
                                    }
                                    />
                                </ListItem>
                            ))}
                        </List>
                        
                    </React.Fragment>
                }
                />
            </ListItem>
        ))}
    </List>
  );
}
