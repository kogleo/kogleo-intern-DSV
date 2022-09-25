import { Link, useNavigate } from 'react-router-dom'
import { login, loginWithFB } from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Box,
    Typography,
    Container,
    Grid, 
    Button,
    Divider,
    TextField} from '@mui/material'; 

import bgImage from '../assets/img/bg_image.png'
import img from '../assets/img/img.png'
import img2 from '../assets/img/img2.png'
import img3 from '../assets/img/img3.png'
import FacebookIcon from '@mui/icons-material/Facebook';
import '../assets/css/signin.css'

// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props' 
  

export default function SignIn() {
    const initialState = { email: '', password: '' }
    
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData
    const { auth } = useSelector(state => state)
    // const listClass = document.querySelectorAll(".transition-image")
    const [activeImage, setActiveImage] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const INTERVAL_DELAY = 5000
    useEffect(() => {
        const interval = setInterval(() => {
        if (activeImage === 2){
            setActiveImage(0)
        }
        else{
            setActiveImage((prev) => (prev+1))
        }
      }, INTERVAL_DELAY)
      return () => clearInterval(interval)
    })

    useEffect(() => {
        if(auth.token) navigate("/")
    }, [auth.token, navigate])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(login(userData))
    }

    const responseFacebook = async (response) => {
        dispatch(loginWithFB({accessToken: response.accessToken, userID: response.userID}))
    }

    useEffect(() => {
        document.title="Login"
    }, [])
    return(
        
        <div>
            <div className='sign-in' >
                <Container maxWidth='md' className='sign-in-container' style={{marginTop: '10vh', height: '100vh'}} >
                    <Grid container style={{height:'90%'}}>
                        <Grid item xs={6} style={{backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat'}}>
                            <Box style={{margin: '27px 0 0 155px', position: 'relative'}}> 
                                <img src={`${img}`} alt="img" className={activeImage === 0 ? "transition-image active" : "transition-image"}/>
                                <img src={`${img2}`} alt="img2" className={activeImage === 1 ? "transition-image active" : "transition-image"}/>
                                <img src={`${img3}`} alt="img3" className={activeImage === 2 ? "transition-image active" : "transition-image"}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1}} 
                            style={{backgroundColor: 'white', maxWidth: '80%', position:'relative', left: '50%', transform: 'translateX(-50%)', border: '1px solid #ccc'}}
                            component='form' onSubmit={handleSubmit}>
                                <Grid container rowSpacing={3} direction='column' 
                                style={{width: '90%', position:'relative', left: '50%', transform: 'translateX(-50%)'}}>
                                    <Grid item xs={12}>
                                        <Link to={'/'} style={{textDecoration: 'none', color: 'black'}}>
                                            <Typography variant='h2' textAlign='center' className='logo'>
                                                Kogleo
                                            </Typography>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth size='small' required onChange={handleChangeInput}
                                        id='email' name='email' label="Email" value={email} variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth size='small' required onChange={handleChangeInput}
                                        type={"password" }
                                        id='password' name='password' label="Password" value={password} variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} marginTop={1}>
                                        {(email && password) ?
                                            <Grid direction="row" rowSpacing={1} container alignItems={'center'} justifyContent={'center' }style={{ width: "100%" }}>
                                                <Button variant="contained" type='submit' size='sm' className='log-in-btn'> Log In </Button>
                                            </Grid>
                                            
                                            :
                                            <Grid container direction="row" rowSpacing={1} alignItems={'center'} justifyContent={'center' }style={{ width: "100%" }}>
                                                <Button disabled variant="contained" className='log-in-btn-dis' size='sm'> Log In</Button>
                                            </Grid>
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider> &nbsp; OR  &nbsp;</Divider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid className='fb-login-container' container direction="row" rowSpacing={1} alignItems={'center'} justifyContent={'center' }style={{ width: "100%" }}>
                                            {/* <Button variant="contained" className='fb-login' startIcon={<FacebookIcon/>}>
                                                Login with Facebook
                                            </Button> */}
                                            <FacebookLogin
                                            // cssClass='fb-login'
                                            appId="2016720668519877"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            // onClick={componentClicked}
                                            callback={responseFacebook}
                                            render={renderProps => (
                                                <Button variant="contained" onClick={renderProps.onClick} className='fb-login' startIcon={<FacebookIcon/>}>
                                                    Login with Facebook
                                                </Button>
                                            )}/>
                                        </Grid>
                                    </Grid>
                                    
                                </Grid>
                            </Box>
                            <Box sx={{flexGrow: 1}} marginTop={2}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                                style={{backgroundColor: 'white', maxWidth: '80%', position:'relative', left: '50%', transform: 'translateX(-50%)', border: '1px solid #ccc', height: '10vh'}}>
                                <Typography variant='subtitle1' textAlign="center" className='text-signup'>Don't have an account? 
                                    <Link to={'/register'} style={{textDecoration: 'none', color: 'rgb(0,149,246)'}}> Sign Up </Link> 
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </div>
        
        
    )
}