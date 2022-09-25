import React from 'react'
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';
import { Grid, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import FavorCmtBtn from '../article/FavouritesComment';
import { deleteComment } from '../../redux/actions/commentActions';
import { useDispatch, useSelector } from 'react-redux';
import { ARTICLE_TYPES } from '../../redux/actions/articleActions';
import { Link } from 'react-router-dom';

const CommentCard = ({children, comment, article, commentId}) => {
    const { auth, feedArticle, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleDeleteComment(cmt){
        let comment = cmt
        dispatch(deleteComment({article, comment, auth, socket}))
        setOpen(false);
    }

    function handleReply(){
        if(feedArticle.onReply) {
            
            return dispatch({type: ARTICLE_TYPES.SET_ON_REPLY, payload: {...article, onReply: false}})
        }
        dispatch({type: ARTICLE_TYPES.SET_ON_REPLY, payload: {...article, onReply: {...comment, commentId}}})
    }

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none',
    }

    const styleReplyComment ={
        marginTop: comment.reply ? '2vh' : 0
    }
    const styleContentReply ={
        marginLeft: comment.reply ? '4vw' : 0,
    }

    return (
        <div className="comment_card" style={styleCard}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Do you want to delete this comment?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={()=>handleDeleteComment(comment)} autoFocus style={{color: 'rgb(237, 73, 86)'}}>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
            <Grid container columnSpacing={1}>
                <Grid item xs={10} className='avatar-comment' style={styleReplyComment}>
                    <Grid container style={styleContentReply}>
                        <Grid item xs={1.5}>
                            <Link to={`/profile/${comment.user.username}`} className="avatar">
                                <Avatar alt={comment.user.username} src={comment.user.image} />
                            </Link>
                        </Grid>
                        <Grid item className='middle-content' xs={10} >
                            <Grid container>
                                <Grid item xs={12} className="name-content">
                                    <Link to={`/profile/${comment.user.username}`} className="avatar" style={{textDecoration: 'none'}}>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary">
                                            <b>{comment.user.username}</b>
                                        </Typography>&nbsp;
                                    </Link>
                                    {comment.tag && 
                                    <Link to={`/profile/${comment.user.username}`} className="avatar" style={{textDecoration: 'none'}}>
                                        <Typography variant="body2" color="rgb(0,55,107)" component="span">
                                            @{comment.tag.username}
                                        </Typography>
                                    </Link>}
                                    &nbsp;<Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {comment.content}
                                    </Typography>
                                </Grid>
                                <Grid item className='comment-footer' xs={12}>
                                    <Grid container direction={'row'} columnSpacing={2}>
                                        <Grid item xs='auto'>
                                            <Typography variant='caption' style={{color: '#ccc'}}>
                                                {<Moment fromNow>{comment.createdAt}</Moment>}
                                            </Typography>
                                        </Grid>
                                        {(comment.likes.length > 0) && 
                                            <Grid item xs='auto'>
                                                <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold'}}>
                                                    {comment.likes.length} likes
                                                </Typography>
                                            </Grid>
                                        }
                                        <Grid item xs='auto'>
                                            {(feedArticle.onReply && feedArticle.onReply?._id === comment._id) ?
                                                <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}} onClick={()=>handleReply(comment)}>
                                                    Cancel
                                                </Typography>
                                                :
                                                <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}} onClick={()=>handleReply(comment)}>
                                                    Reply
                                                </Typography>
                                            }
                                        </Grid>
                                        <Grid item xs='auto'>
                                            {(auth.user?._id === comment.user._id) &&
                                                <Typography variant='caption' onClick={handleClickOpen} style={{opacity: 0.5, color: 'rgb(237, 73, 86)', fontWeight: 'bold', cursor: 'pointer'}} >
                                                    Delete
                                                </Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>    
                            </Grid>
                            
                        </Grid>
                          
                    </Grid>
                </Grid>
                <Grid item xs={2} className='favor-btn' justifyContent="center" alignItems="center" style={{height: '100%'}}>
                    <FavorCmtBtn comment={comment} auth={auth} article={article}/>
                </Grid>
            </Grid>
        {children}
            
        </div>
    )
}

export default CommentCard
