import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../redux/actions/commentActions'
// import Icons from '../Icons'
import { TextField, Button, Grid, Box } from '@mui/material'

const CommentField = ({children, article, onReply, setOnReply}) => {
    const [content, setContent] = useState('')

    const { auth} = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!content.trim()){
            if(setOnReply) return setOnReply(false);
            return;
        }
        setContent('')
        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        
        dispatch(createComment({article, newComment, auth}))

        if(setOnReply) return setOnReply(false);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <form className="card comment-form" onSubmit={handleSubmit} >
                {children}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        id="outlined-multiline-static"
                        label={auth.user.username}
                        multiline
                        // rows={2}
                        maxRows={4}
                        placeholder="Comment here"
                        defaultValue=""
                        onChange={e => setContent(e.target.value)}
                        fullWidth
                    />
                    </Grid>
                    <Grid item xs={12} alignItems='right'> 
                        <Button type="submit" className="postBtn" variant="contained" color="primary">
                            Post Comment
                        </Button>
                    </Grid>
                </Grid>
                
                
                {/* <input type="text" placeholder="Add your comments..."
                value={content} onChange={e => setContent(e.target.value)}/> */}

                {/* <Icons setContent={setContent} content={content} theme={theme} /> */}

                
            </form>
        </Box>
    )
}

export default CommentField
