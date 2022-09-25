import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link} from 'react-router-dom'
import { register, loginWithFB } from '../redux/actions/authAction'
import valid from '../utils/valid';
import { GLOBALTYPES } from '../redux/actions/globalTypes'

import { Box,
        Typography,
        Container,
        Grid, 
        Button,
        Divider,
        TextField} from '@mui/material';    

import FacebookIcon from '@mui/icons-material/Facebook';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props' 

import '../assets/css/signup.css'

const SignUp = () => {

    const { auth, alert } = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const initialState = { 
        username: '', email: '', password: ''
    }
    const [userData, setUserData] = useState(initialState)
    const {username, fullname,  email, password} = userData
    // const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if(auth.token) navigate("/")
    }, [auth.token, navigate])

    
    const handleChangeInput = e => {
        const { name, value } = e.target
        
        setUserData({...userData, [name]:value})
        const check = valid({...userData, [name]:value})
        if(check.errLength > 0){   
            return dispatch({type: GLOBALTYPES.ALERT, payload: check.errMsg})
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        // setIsOpen(true)
        dispatch(register(userData))
        // CustomizeAlert(isOpen, alert.error, alert.error ? "error" : "success")
    }
    const responseFacebook = async (response) => {
        dispatch(loginWithFB({accessToken: response.accessToken, userID: response.userID}))
    }
    useEffect(() => {
        document.title="Register"
    }, [])
    return(
        <div>
            <div className='sign-up'>
                    <Container maxWidth='sm' className='sign-up-container' style={{marginTop: '5vh'}}>
                        <Box sx={{flexGrow: 1}} 
                        style={{backgroundColor: 'white', maxWidth: '65%', position:'relative', left: '50%', transform: 'translateX(-50%)', border: '1px solid #ccc'}}
                        component='form' onSubmit={handleSubmit}>
                            <Grid container rowSpacing={1} direction='column' 
                            style={{width: '80%', position:'relative', left: '50%', transform: 'translateX(-50%)'}}>
                                <Grid item xs={12}>
                                    <Typography variant='h2' textAlign='center' className='logo'>
                                        Kogleo
                                    </Typography>
                                    <Typography variant='subtitle1' className='description' textAlign='center' marginTop={1} marginBottom={1}>
                                        Sign up to see wonderful <br/> moments from your friends.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className='fb-login'>
                                    <Grid container direction="row" alignItems={'center'} justifyContent={'center' }style={{ width: "100%" }}>
                                        {/* <Button variant="contained" startIcon={<FacebookIcon/>}>
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
                                <Grid item xs={12}>
                                    <Divider className='divide'> &nbsp;  OR  &nbsp;</Divider>
                                </Grid>
                                <Grid item xs={12}>
                                    {(alert.email && email) ?
                                    <TextField
                                        type={"email"}
                                        fullWidth size='small'
                                        error
                                        id='email' name='email'
                                        label="Error "
                                        onChange={handleChangeInput}
                                        value={email}
                                        helperText={alert.email}
                                    />
                                    :
                                    <TextField fullWidth size='small' required onChange={handleChangeInput}
                                    type={"email"}
                                    id='email' name='email' label="Email" value={email} variant="outlined" />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    {(alert.fullname && fullname) ?
                                    <TextField
                                        fullWidth size='small'
                                        error
                                        id='fullname' name='fullname'
                                        label="Error "
                                        onChange={handleChangeInput}
                                        value={fullname}
                                        helperText={alert.fullname}
                                    />
                                    :
                                    <TextField fullWidth size='small' required onChange={handleChangeInput}
                                    id='fullname' name='fullname' label="Fullname" value={fullname} variant="outlined" />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    {(alert.username && username) ?
                                    <TextField
                                        fullWidth size='small'
                                        error
                                        id='username' name='username'
                                        label="Error "
                                        onChange={handleChangeInput}
                                        value={username}
                                        helperText={alert.username}
                                    />
                                    :
                                    <TextField fullWidth size='small' required onChange={handleChangeInput}
                                    id='username' name='username' label="Username" value={username.toLowerCase().replace(/ /g, '')}
                                    variant="outlined" />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    {(alert.password && password) ?
                                    <TextField
                                        fullWidth size='small'
                                        error
                                        type={ "password" }
                                        id='password' name='password'
                                        label="Error "
                                        onChange={handleChangeInput}
                                        value={password}
                                        helperText={alert.password}
                                    />
                                    :
                                    <TextField fullWidth size='small' required onChange={handleChangeInput}
                                    type={ "password" }
                                    id='password' name='password' label="Password" value={password} variant="outlined" />
                                    }   
                                </Grid>
                                <Grid item xs={12} marginTop={2} marginBottom={5}>
                                    {(email && username && fullname && password) ?
                                        <Grid container direction="row" rowSpacing={1} alignItems={'center'} justifyContent={'center' }style={{ width: "100%" }}>
                                            <Button className='sign-up-btn' variant="contained" type='submit'> Sign Up</Button>
                                        </Grid>
                                        
                                        :
                                        <Grid container direction="row" rowSpacing={1} alignItems={'center'} justifyContent={'center' }style={{ width: "100%" }}>
                                            <Button className='sign-up-btn-dis' disabled variant="contained" > Sign Up</Button>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{flexGrow: 1}} marginTop={2} 
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                            style={{backgroundColor: 'white', maxWidth: '65%', position:'relative', left: '50%', transform: 'translateX(-50%)', border: '1px solid #ccc', height: '10vh'}}>
                            <Typography variant='subtitle1' textAlign="center">Have an account? 
                                <Link to={'/login'} style={{textDecoration: 'none', color: 'rgb(0,149,246)'}}> Log In </Link> 
                            </Typography>
                        </Box>
                    </Container>
            </div>   
        </div>
        
        
    )
}

export default SignUp