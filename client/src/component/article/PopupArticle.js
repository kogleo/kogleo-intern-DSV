import React from 'react'
import { Grid, Box,Button , Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from '@mui/material'
import { Link } from 'react-router-dom'

import { deleteArticle } from "../../redux/actions/articleActions";
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useNavigate } from 'react-router-dom'
import { ARTICLE_TYPES } from "../../redux/actions/articleActions";
import '../../assets/css/article/popupArticle.css'


export default function     PopupArticle({slug}){
    const { auth, detailArticle, socket} = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        // dispatch({type: ARTICLE_TYPES.OPEN_POPUP_ARTICLE, payload: {...article, openPopupArticle: false}})
    };

    const handleClose = () => {
        setOpen(false);
    };

    const article = detailArticle.filter(article=> article.slug === slug)[0]

    const handleDeleteArticle = () => {
        setOpen(false);
        dispatch(deleteArticle({article, auth, socket}))
        navigate("/")
        dispatch({type: ARTICLE_TYPES.OPEN_POPUP_ARTICLE, payload: {...article, openPopupArticle: false}})
    }
    const handleEditArticle = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: {...article, onEdit: true}})
        dispatch({type: ARTICLE_TYPES.OPEN_POPUP_ARTICLE, payload: {...article, openPopupArticle: false}})
    }
    const handleCancle = () => {
        dispatch({type: ARTICLE_TYPES.OPEN_POPUP_ARTICLE, payload: {...article, openPopupArticle: false}})
    }

    return(
        <div className='popup-article'>
             <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete Article?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this article? <br/>
                    If you delete this article, you cannot recovery it by any way.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteArticle} autoFocus style={{color: 'rgb(237, 73, 86)'}}>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
            <Box className='cover'>
            </Box>
        
            <Grid container className="content">
                <Grid item xs={12} padding={2}>
                    <Typography variant='h6' onClick={handleClickOpen}
                     textAlign={'center'} style={{color: 'rgb(237, 73, 86)', cursor: 'pointer'}}>Delete</Typography>
                </Grid>
                
                <Grid item xs={12} padding={2} borderTop='1px solid #ccc'>
                    <Link to={`/articleconfig/${slug}`} style={{textDecoration: 'none'}}>
                        <Typography variant='h6' textAlign={'center'} style={{color: 'rgb(0, 149, 246)'}} onClick={handleEditArticle}>Edit</Typography>
                    </Link>
                </Grid>
                
                <Grid item xs={12} padding={2} borderTop='1px solid #ccc'>
                    <Typography variant='h6' onClick={handleCancle} style={{cursor: 'pointer'}} textAlign={'center'}>Cancel</Typography>
                </Grid>
            </Grid>
        </div>
    )
}