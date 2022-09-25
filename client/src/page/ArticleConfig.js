import HeaderBar from "../component/Header";
import React, { useState,  useEffect } from 'react'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { createArticle, updateArticle } from '../redux/actions/articleActions'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getArticle } from '../redux/actions/articleActions'
import { Container, 
        Box, 
        TextField, 
        Typography, 
        Grid, 
        IconButton, 
        Button, 
        ImageList, 
        ImageListItem,
        ImageListItemBar, 
        Chip,
        Stack } from "@mui/material";
import CameraAltTwoToneIcon from '@mui/icons-material/CameraAltTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import { imageUpload } from "../utils/imageUpload";

export default function ArticleConfig(){

    const dispatch = useDispatch()
    const { slug } = useParams()
    const initState = {
        title: '', description: '', body: '', taglist: []
    }
    const [articleData, setArticleData] = useState(initState)
    const [images, setImages] = useState(null) //use images for display preview image 
    const [cloudImage, setCloudImage] = useState(null)    //and cloudImage for cloudinary
    const [isLoading, setIsLoading] = useState(false)
    var {title, description, body, taglist} = initState
    
    if (articleData){
        title = articleData.title
        description = articleData.description
        body = articleData.body
        taglist = articleData.taglist
    }
    const { auth, status, detailArticle, socket} = useSelector(state => state)
    // const [onEdit, setOnEdit] = useState(false)
    // const [content, setContent] = useState('')
    // const [stream, setStream] = useState(false)
    // const videoRef = useRef()
    // const refCanvas = useRef()
    // const [tracks, setTracks] = useState('')

    useEffect(() => {
        if(status.onEdit){
            document.title = "Edit your article"
        } else {
            document.title = "Create a new article"
        }
    }, [status.onEdit])
    useEffect(() => {
        if (slug){
            dispatch({ type: GLOBALTYPES.STATUS, payload: {onEdit: true}})
        }
    }, [dispatch, slug])
    
    const handleSubmit = (e) => {
        e.preventDefault()
        // if(images.length === 0)
        // return dispatch({ 
        //     type: GLOBALTYPES.ALERT, payload: {error: "Please add your photo."}
        // })

        if(status.onEdit){
            if(title.length > 255){
                let err = "Title character must not over 255"
                dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
                err = ""
                return
            }

            if(taglist.length > 5){
                let err = "Tags must not over 5"
                dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
                err = ""
                return
            }
            
            setIsLoading(true)
            if (cloudImage){
                imageUpload(cloudImage).then((res) => {
                    let cloudImage = res
                    dispatch(updateArticle({title, description,body,taglist, cloudImage, auth, slug, socket}))
                    setIsLoading(false)
                })
            }
            else{
                setIsLoading(true)
                dispatch(updateArticle({title, description,body,taglist, auth, slug, socket}))
                setIsLoading(false)
            }
            
            
        }else{
            if(title.length > 255){
                let err = "Title characters must not over 255"
                dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
                err = ""
                return
            }

            if(taglist.length > 5){
                let err = "Tags must not over 5"
                dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
                err = ""
                return
            }
            setIsLoading(true)
            if(!cloudImage){
                let err = "Please add your photo"
                dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
                err = ""
                setIsLoading(false)
                return
            }
            imageUpload(cloudImage).then((res) => {
                let cloudImage = res
                dispatch(createArticle({title, description,body,taglist, cloudImage, auth, socket}))
                setIsLoading(false)
            })        
        }
        setImages(null) 
        setArticleData({
            title: '',
            description: '',
            body: '',
            taglist: []
        })
    }


    const handleChangeTagList = (e) => {
        let temp = e.target.value.split(',')
        setArticleData({...articleData, taglist: temp})
    }

    const onImageChange = (e) => {
        const file = e.target.files
        console.log("here")
        let err = ""
        if(!file[0]){
            err = "File does not exist."
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
            err = ""
            return
        }

        if(file[0].size > 1024 * 1024 * 5){
            err = "Your image size is over 5mb."
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
            err = ""
            return
        }
        if(file[0].type !== 'image/jpeg' && file[0].type !== 'image/png' && file[0].type !== 'image/jpg'){
            err = "Image format is incorrect."
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
            err = ""
            return
        }

    
        if (file && file[0]) {
            setCloudImage(file[0])
            setImages(URL.createObjectURL(file[0]));
        }
       }
    const deleteImages = () => {
        setCloudImage(null)
        setImages(null)
    }

    const handleDeleteChip = (e) => {
        const newTaglist = [...taglist]
        newTaglist.splice(e.target.value, 1)
        setArticleData({...articleData, taglist: newTaglist})
    }

    useEffect( () => {
        if(status.onEdit){
            setArticleData({
                title: detailArticle.title,
                description: detailArticle.description,
                body: detailArticle.body,
                taglist: detailArticle.taglist
            })
        }
            
    },[detailArticle,status.onEdit ])

    useEffect(() => {
        if (status.onEdit)
        {
            if (auth.token){
                dispatch(getArticle({detailArticle, slug, auth}))
            }
    
            if(detailArticle.length > 0){
                const newArr = detailArticle.filter(article => article.slug === slug)[0] 
                setImages(newArr?.image)
                setArticleData({
                    title: newArr.title,
                    description: newArr.description,
                    body: newArr.body,
                    taglist: newArr.taglist
                })
            }
        }
    },[auth, dispatch, slug, detailArticle, status.onEdit])

    
    const handleInput = e => {
        const { name, value } = e.target
        setArticleData({ ...articleData, [name]:value })
    }

    return(
        <div className="editor-page">
            <HeaderBar page="editor"/>
            <Container maxWidth="xl">
                <Box component="form" sx={{  maxHeight: '90vh',  maxWidth: '100%'}} onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{width: '80%', margin: '10px auto'}}>
                        <Grid item xs={12}>
                            <Typography variant="h5" textAlign='center' marginTop='2vh'>Create Your Own Article!</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Title" id="title" name='title' placeholder="Enter Title Here" required
                            onChange={handleInput} value={title}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Description" id="description" name='description' placeholder="About your article"
                            onChange={handleInput} value={description}/>
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                accept="image/*"
                                className='image-upload'
                                id="image-upload"
                                onChange={onImageChange}
                                type="file"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image-upload" >
                                <Button color="primary" component="span" variant="outlined" size="large">
                                    <CameraAltTwoToneIcon /> &nbsp; <Typography variant='subtitle1'>Add a photo</Typography>
                                </Button> <Typography variant="body2" component={"span"} fontStyle="italic">(*Image is required)</Typography>
                            </label>
                            {images &&
                                <ImageList sx={{ width: 500, height: 450 }} cols={1} rowHeight={450}>
                                    
                                    <ImageListItem key={images}>
                                        <img
                                            src={`${images}`}
                                            srcSet={`${images}`}
                                            alt={title}
                                            loading="lazy"
                                            style={{width: '450px', height: '450px'}}
                                        />
                                        <ImageListItemBar
                                        style={{background: 'none'}}
                                        title={title}
                                        position="top"
                                        actionIcon={
                                        <IconButton>
                                            <ClearTwoToneIcon onClick={() => deleteImages()} style={{cursor: 'pointer'}}/>
                                        </IconButton>
                                        }
                                        actionPosition="left"
                                    />
                                    </ImageListItem>
                                </ImageList>
                            }

                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline
                            minRows={10} label="Content" id="body" name='body' placeholder="What are you thinking?"
                            onChange={handleInput} value={body} />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline
                                    label="Tag" id="body"placeholder="Tags here (Seperated by comma ',')"
                                    value={taglist} onChange={handleChangeTagList} name='taglist'/>
                                </Grid>
                                <Grid item xs={12}>
                                <Stack direction="row" spacing={2}>
                                    {taglist && taglist.map((tag, index)=>(
                                        <Chip label={tag} onDelete={handleDeleteChip} key={tag + index} value={index}/>
                                    ))}
                                </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} alignItems='center' marginBottom={1}>
                            <Button color="success" type="submit" variant="contained" size="large" disabled={isLoading}
                            style={{width: '100%', margin: 'auto'}}>{!slug ? 'PUBLISH ARTICLE' : 'UPDATE ARTICLE'}</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            
        </div>
    )
}