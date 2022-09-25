import { Divider, Typography, Grid } from '@mui/material'
import React, { useState, useEffect} from 'react'
import CommentCard from './CommentCard'

const CommentDisplay = ({comment, article, replyCm}) => {
    const [showRep, setShowRep] = useState([])
    const [next, setNext] = useState(1)
    useEffect(() => {
        setShowRep(replyCm.slice(0, (next)))
    },[replyCm, next])

    return (
        <div className="comment_display" style={{marginTop: '3vh'}}>
            <CommentCard comment={comment} article={article} commentId={comment._id} >
                <div className="pl-4 replyComment">
                    {(replyCm.length >0) && (replyCm.length - next  > 0
                        ? 
                            <Grid container columnSpacing={0} alignItems={'center'}>
                                <Grid item xs={2} >
                                    <Divider variant="middle"/>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='caption' style={{color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}}
                                    onClick={() => setNext(next + 3)}>
                                        <b>View replies ({replyCm.length - next})</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            
                        : <Grid container columnSpacing={0} alignItems={'center'}>
                                <Grid item xs={2} >
                                    <Divider variant="middle"/>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='caption' style={{ color: '#ccc', fontWeight: 'bold', cursor: 'pointer'}}
                                    onClick={() => setNext(0)}>
                                        <b>Hide replies</b>
                                    </Typography>
                                </Grid>
                            </Grid>)
                        }
                    {
                        showRep.map((item, index) => (
                            item.reply &&
                            <CommentCard
                            key={index}
                            comment={item}
                            article={article}
                            commentId={comment._id}
                            style={{marginLeft: '2vw'}}
                             />
                        ))
                    }
                </div>
                
            </CommentCard>
        </div>
    )
}

export default CommentDisplay
