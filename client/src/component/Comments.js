import React, { useState, useEffect } from 'react'
import CommentDisplay from '../component/comment/CommentDisplay'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

const Comments = ({article}) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(5)

    const [replyComments, setReplyComments] = useState([])

    useEffect(() => {
        const newCm = article.comments.filter(cm => !cm.reply).sort((firstItem, secondItem) => firstItem.createdAt - secondItem.createdAt).reverse()
        setComments(newCm)
        setShowComments(newCm.slice(0, next))
    },[article.comments, next])

    useEffect(()=> {
        const newRep = article.comments.filter(cm => cm.reply)
        setReplyComments(newRep)
    }, [article.comments])
    

    return (
        <div className="comments" style={{height: '100%'}}>
            {
                showComments.length > 0 ?
                     showComments.map((comment, index) => (
                    <CommentDisplay key={index} comment={comment} article={article}
                    replyCm={replyComments.filter(item => item.reply === comment._id).sort((firstItem, secondItem) => firstItem.createdAt - secondItem.createdAt)} />
                ))
                :
                <Box style={{position: "relative", top: "30%", height: '100%'}}>
                    <Typography variant='h5' fontWeight={"bold"} textAlign="center">No comments yet</Typography>
                    <Typography variant='body2' textAlign="center">Start the conversation </Typography>

                </Box>
            }

            {
                comments.length - next > 0
                && 
                <Box display="flex" justifyContent={'center'} >
                    <Tooltip arrow title="View more comments">
                        <IconButton onClick={() => setNext(next + 10)}> 
                            <AddCircleOutlineIcon style={{color: 'black'}} fontSize="large"/>
                        </IconButton>
                    </Tooltip>
                </Box>
                
                

            }
        </div>
    )
}

export default Comments
