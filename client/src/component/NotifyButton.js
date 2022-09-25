import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Badge, ClickAwayListener, Grid, Box, Typography, Avatar, Divider, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import { deleteAllNotifies, isReadNotify} from '../redux/actions/notifyAction'
import Moment from 'react-moment';

import '../assets/css/notify.css'
import { Link} from 'react-router-dom';




function NotifyModal({clickAwayHandler, notifies, auth}){
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const deleteAll = () => {
        setOpen(false)
        dispatch(deleteAllNotifies(auth.token))
    }
    return(
        <ClickAwayListener onClickAway={clickAwayHandler}>   
        <Box style={{
            position: 'absolute'
        }}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Do you want to delete all notifies?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={deleteAll} autoFocus style={{color: 'rgb(237, 73, 86)'}}>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
            <Box style={{
                backgroundColor: 'white',
                border: '1px solid rgb(255,255,255)',
                boxShadow: '0.5px 0.5px rgba(0,0,0,.0975)',
                height: '14px',
                width: '14px',
                transform: 'rotate(-135deg) translateX(-50%)',
                position: 'absolute',
                transformOrigin: 'center left',
                top: '22px',
                left: '50%',
                // transform: '',
                zIndex: '200'
            }}>
            </Box>
            <Box style={{
                width: '32vw', 
                height: '42vh', 
                position: 'absolute', 
                zIndex: 100, 
                top: '30px', 
                borderRadius: '6px',
                boxShadow: '0 0 5px 1px rgba(0,0,0,.0975)',
                right: '-5vw',
                backgroundColor: 'white'}} 
                className="notification">
                
                <Typography variant='h6' style={{marginLeft: '1vw'}} textTransform={'none'} textAlign='left'>Notification</Typography>
                <Divider/>
                <Grid container rowSpacing={2} marginTop={1} className='noti-grid'
                style={{
                    width: '100%',
                    maxHeight: '32vh',  
                    position: 'absolute',
                    overflowY: 'scroll'
                }} 
                > 
                    {notifies.data.map((noti, index)=>(
                        <Grid item xs={12} key={index} component={Link} to={`${noti.url}`} style={{textDecoration: 'none'}}>
                            <Grid container 
                                paddingLeft={1.5}
                                justifyContent={'flex-start'}
                                alignItems='center'>
                                <Grid item className='avatar-noti' xs={1.5}>
                                    <Avatar alt={noti.user.username} src={noti.user.image} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Grid container>
                                        <Grid item xs={12} container justifyContent='flex-start' alignItems={'flex-start'}>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                textAlign={'left'}
                                                style={{textTransform: 'none'}}>
                                                <b>{noti.user.username}</b>&nbsp;{noti.text }&nbsp;{noti.content} 
                                            </Typography>&nbsp;
                                            <Typography variant='body2' style={{color: '#ccc', textTransform: 'none'}}>
                                                <Moment fromNow ago>{noti.createdAt}</Moment>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item className='avatar-noti' xs={1.5}>
                                    <Avatar alt={noti.user.username} src={noti.image}  variant='square'/>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                    
                </Grid>
                { notifies.data.length > 0 && <Grid container style={{marginTop: "33vh", borderTop: '1px solid #ccc'}}>
                    <Divider/>
                        <Grid item xs={12}>
                            <Typography variant='h6' textTransform={'none'} style={{color: 'rgb(237, 73, 86)'}} onClick={handleClickOpen}>Delete All Notifies</Typography>
                        </Grid>
                    </Grid>
                }
                

            </Box>
        </Box>
        </ClickAwayListener> 
    )
    
}


export default function NotifyButton(){

    const { auth, notify } = useSelector(state => state)
    const [open, setOpen] = useState(false)
    const [displayBadge, setDisplayBadge] = useState(false)
    const clickAwayHandler = () => setOpen(false)
    const dispatch = useDispatch()
    const clickHandler = (event) => {
        setDisplayBadge(false)
        if (displayBadge){
            for (let msg of notify.data){
                dispatch(isReadNotify({msg, auth}))
            }
        }
        
        setOpen((prev)=> (!prev))
    }
    useEffect(()=>{
        if (notify.data.length > 0){
            if (notify.data.some(noti => noti.isRead === false)){
                setDisplayBadge(true)
            }
        }
    }, [notify])
    return(
        <ClickAwayListener onClickAway={clickAwayHandler}>
            <>

                    {displayBadge ? 
                        <Badge color='error' variant="dot">
                            {!open ? <FavoriteBorderOutlinedIcon onClick={clickHandler} sx={{ fontSize: 30 }}/> : <FavoriteIcon sx={{ fontSize: 30 }}/>}
                        </Badge>
                    :
                        !open ? <FavoriteBorderOutlinedIcon onClick={clickHandler} sx={{ fontSize: 30 }}/> : <FavoriteIcon sx={{ fontSize: 30 }}/>
                    }
                    {open && <NotifyModal open={open} clickAwayHandler={clickAwayHandler} notifies={notify} auth={auth}/>}
            </>
        </ClickAwayListener> 
    )
}