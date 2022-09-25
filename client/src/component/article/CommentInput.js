import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentActions'
import { ARTICLE_TYPES } from '../../redux/actions/articleActions'
// import Icons from '../Icons'
import { TextField, Grid, Box,Avatar} from '@mui/material'
import {Link, useNavigate} from "react-router-dom"

export default function CommentInput(props){
       
    const {children, article} = props
    const [content, setContent] = useState('')

    const { auth, feedArticle, socket} = useSelector(state => state)
    const dispatch = useDispatch()
    // const [onReply, setOnReply] = useState(feedArticle.onReply)
    const navigate = useNavigate()
    let replyInput = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    useEffect(()=>{
        if(feedArticle.onReply)
        {
            setTimeout(() => {
                replyInput.current.focus()
            }, 100)
            return;
        }
    }, [feedArticle.onReply])

    const handleEnter = (e) => {
        
        if (e.keyCode === 13 && !e.shiftKey){
            e.preventDefault()
            if(!content.trim()){
                if(feedArticle.onReply) return dispatch({type: ARTICLE_TYPES.SET_ON_REPLY, payload: {...article, onReply: false}})
            }

            if (!auth.user){
                navigate('/login')
            }
            
            const newComment = {
                content,
                likes: [],
                user: auth.user,
                createdAt: new Date().toISOString(),
                reply: feedArticle.onReply ? feedArticle.onReply.commentId : null,
                tag: feedArticle.onReply && feedArticle.onReply.user
            }
            setContent('')
            dispatch(createComment({article, newComment, auth, socket}))
            dispatch({type: ARTICLE_TYPES.SET_ON_REPLY, payload: {onReply: false}})
            // if(setOnReply) return setOnReply(false);
        }
    }

    return(
        <Box sx={{ flexGrow: 0 }} 
        className='card comment-form' component={'form'} 
        onSubmit={handleSubmit} height={1}> 
                {children}
                <Grid container height={1} columnSpacing={2} alignContent="flex-end">
                    <Grid item xs={1} lg={1} container >
                        <Avatar alt={auth.user?.username} src={auth.user?.image} />
                    </Grid>
                    <Grid item xs={10} lg={11} container alignItems='center' justifyContent="flex-end">
                        {!feedArticle.onReply ? 
                        <TextField
                            id="input-comment"
                            multiline
                            variant="outlined"
                            minRows={1}
                            placeholder="Comment here"
                            // defaultValue={content}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            fullWidth
                            autoFocus
                            // disableUnderline
                            size='small'
                            onKeyDown={(e)=>handleEnter(e)}
                            InputProps={{
                                style: {borderRadius: '50px'}
                            }}    
                            className='comment-input'   
                            style={{height: '100%'}}             
                        />
                        :
                        <TextField
                            id="input-comment-reply"
                            multiline
                            variant="outlined"
                            minRows={1}
                            placeholder=""
                            // defaultValue={}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            fullWidth
                            inputRef={replyInput}
                            // disableUnderline
                            size='small'
                            onKeyDown={(e)=>handleEnter(e)}
                            InputProps={{
                                startAdornment: <Link to={"#"} style={{color: 'rgb(0, 149, 246)', textDecoration: 'none'}}>@{feedArticle.onReply.user?.username}&nbsp;</Link>, 
                                style: {borderRadius: '50px'}
                            }}     
                            
                            className='comment-input'   
                            style={{height: '100%'}}                     
                        />
                        }

                    </Grid>
                </Grid>
        </Box>
    )
}