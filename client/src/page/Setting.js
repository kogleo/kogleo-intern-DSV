import HeaderBar from "../component/Header";
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { updateProfileUser } from '../redux/actions/profileAction'
import { imageUpload } from "../utils/imageUpload";

import {
    Typography,
    Container,
    Grid, 
    Button,
    Divider,
    TextField,
    Avatar} from '@mui/material'; 

export default function Setting(){
    const dispatch = useDispatch()
    const initState = {
        image: '', fullname: '', username: '', bio: '', email: '', password: ''
    }
    const [userData, setUserData] = useState(initState)
    const [isLoading, setIsLoading] = useState(false)
    var {image, fullname, username, bio, email, password} = initState
    if (userData){
        image =  userData.image
        fullname = userData.fullname
        username = userData.username
        bio = userData.bio
        email = userData.email
        password = userData.password
    }
    const {auth, socket} = useSelector(state => state)

    // const [avatar, setAvatar] = useState(auth.user?.image)
    const [cloudImage, setCloudImage] = useState(null)    //and cloudImage for cloudinary

    useEffect(() => {
        setUserData(auth.user) 
    }, [auth.user])


    // const changeAvatar = (e) => {
    //     const file = e.target.files[0]

    //     const err = checkImage(file)
    //     if(err) return dispatch({
    //         type: GLOBALTYPES.ALERT, payload: {error: err}
    //     })

    //     setAvatar(file)
    // }

    const handleInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]:value })
    }

    const onImageChange = (e) => {
        const file = e.target.files
        let err = ""
        if(!file[0]){
            err = "File does not exist."
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
            err = ""
            return
        }

        if(file[0].size > 1024 * 1024 * 5){
            err = "The image/video largest is 5mb."
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

        // imageUpload(file[0])
    
        if (file && file[0]) {
            setCloudImage(file[0])
            setUserData({...userData, image: URL.createObjectURL(file[0])});
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        setIsLoading(true)
        imageUpload(cloudImage ? cloudImage : image).then((res) => {
            let cloudImage = res
            let userDatas={...userData, image: cloudImage }
            dispatch(updateProfileUser({userDatas , auth, socket}))
            setUserData(auth.user)
            setIsLoading(false)
        })
    }
    useEffect(() => {
        document.title="Setting"
    }, [])
    return(
        <div className="settings-page">
            <HeaderBar/>
            <Container maxWidth='md' component='form' onSubmit={handleSubmit}
            style={{backgroundColor:'white', height: '80vh', marginTop: '5vh', padding: '0', border: '1px solid #ccc'}} >
                <Typography variant="h3" textAlign='center'>Your Setting</Typography>
                <Divider/>
                <Grid container rowSpacing={2} marginTop={2} style={{width: '80%'}}>
                    <Grid item xs={12}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={5} container justifyContent="flex-end" alignItems="center">
                                <Avatar alt={username} src={image} sx={{ width: 56, height: 56 }}/>    
                            </Grid>
                            <Grid item xs={7} container justifyContent="flex-start" alignItems="center">
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
                                     &nbsp; <Typography variant='subtitle1'>Change Your Photo</Typography>
                                </Button>
                            </label>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={5} container justifyContent="flex-end" alignItems="center">
                                <Typography><b>Full Name</b></Typography>   
                            </Grid>
                            <Grid item xs={7} container justifyContent="flex-start">
                                <TextField id="fullname" name="fullname" value={fullname} onChange={handleInput}
                                 size='small' fullWidth />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={5} container justifyContent="flex-end" alignItems="center">
                                <Typography><b>Username</b></Typography>     
                            </Grid>
                            <Grid item xs={7} container justifyContent="flex-start">
                                <TextField id="username" name="username" value={username} onChange={handleInput}
                                 size='small' fullWidth/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={5} container justifyContent="flex-end" alignItems="center">
                                <Typography><b>Bio</b></Typography>     
                            </Grid>
                            <Grid item xs={7} container justifyContent="flex-start">
                                <TextField multiline minRows={2} fullWidth
                                id="bio" name="bio" value={bio} onChange={handleInput} size='small'/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={5} container justifyContent="flex-end" alignItems="center">
                                <Typography><b>Email</b></Typography>     
                            </Grid>
                            <Grid item xs={7} container justifyContent="flex-start">
                                <TextField id="email" name="email" value={email} onChange={handleInput}
                                 size='small' fullWidth/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container columnSpacing={2}>
                            <Grid item xs={5} container justifyContent="flex-end" alignItems="center">
                                <Typography><b>Password</b></Typography>     
                            </Grid>
                            <Grid item xs={7} container justifyContent="flex-start">
                                <TextField id="password" name="password" value={password} onChange={handleInput}
                                 size='small' fullWidth type='password' placeholder="Enter new password"/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent='center'>
                            <Button disabled={isLoading} type="submit" variant="contained" color="primary" style={{textTransform: 'none'}}>
                                Submit
                            </Button>
                        </Grid>
                        
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

// export default Setting;