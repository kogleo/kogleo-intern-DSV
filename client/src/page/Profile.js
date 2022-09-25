import HeaderBar from "../component/Header"
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { getProfileUsers, PROFILE_TYPES } from '../redux/actions/profileAction'
import { useParams } from 'react-router-dom'
import { useMemo } from "react";
import PropTypes from 'prop-types';
import { Button, Typography, Tab, Box, Grid,Tabs, Avatar, Container } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileFeed from "../component/ProfileFeed";
import GridOnIcon from '@mui/icons-material/GridOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserCard from "../component/UserCard";
import ProfileFollowBtn from "../component/profile/profileFollowBtn";

const theme = createTheme({
    palette: {
      secondary: {
        main: 'rgb(0,0,0)'
      }
    }
});



function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 0 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export function ProfileTab(props){
    const [value, setValue] = useState(0);
    const {articles, favArticles} = props
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="secondary tabs example" 
                    textColor="secondary"
                    indicatorColor="secondary" centered>
                        <Tab iconPosition="start" icon={<GridOnIcon/>} label='Articles' {...a11yProps(0)} style={{textTransform: 'none'}}/>
                        <Tab iconPosition="start" icon={<FavoriteBorderIcon/>} label="Favourited" {...a11yProps(1)} style={{textTransform: 'none'}}/>
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ProfileFeed articles={articles}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ProfileFeed articles={favArticles}/>
                </TabPanel>
            </Box>
        </ThemeProvider>
    );
}


export default function Profile(){
    const dispatch = useDispatch()
    const usernameLink = useParams().username
    const [articles, setArticles] = useState([])
    const [favArticles, setfavArticles] = useState([])
    const {auth, profile} = useSelector(state => state)
    const [cardUser, setCardUser] = useState([])
    const [userData, setUserData] = useState([])
    const [typeCard, setTypeCard] = useState('')

    useEffect(() => {
        document.title=`${usernameLink}`
    }, [usernameLink])

    useEffect(() => {
        dispatch(getProfileUsers({usernameLink, auth}))
    }, [auth, usernameLink, dispatch])

    useEffect(() => {
        if(usernameLink === auth.user?.username){
            setUserData(auth.user)
        }else{
            const newData = profile.users.filter(user => user.username === usernameLink)
            setUserData(newData[0])
        }
    }, [usernameLink,auth, dispatch, profile.users])

    useMemo(() => {
        setArticles(profile.articles)
        setfavArticles(profile.favouritedArticles)
    }, [profile.articles, profile.favouritedArticles])

    const handleOpenFollowCard = () =>{
        setCardUser(userData?.followers)
        setTypeCard("Followers")
        dispatch({type: PROFILE_TYPES.OPEN_USER_CARD, payload: {...profile, openCard: true}})
    }
    const handleOpenFollowingCard = () =>{
        setCardUser(userData?.following)
        setTypeCard("Following")
        dispatch({type: PROFILE_TYPES.OPEN_USER_CARD, payload: {...profile, openCard: true}})
    }

    

    return(
        <div className="profile-page">
            {profile.openCard && 
                <UserCard users={cardUser} typeCard={typeCard} profile={profile} auth={auth}/>
            }
            <HeaderBar/>
            <div className="top-profile" >
                <Box sx={{  width: {xs: '100%', md: '80%', lg: '60%'}}} style={{position: 'relative', left: '50%', top: '4vh', transform: 'translate(-50%, -0%)'}} >
                    <Grid container spacing={1}>
                        <Grid item xs={5}>
                            <Avatar 
                            alt={userData?.username}
                            src={userData?.image}
                            sx={{ width: 150, height: 150 }}
                            style={{position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}/>
                        </Grid>
                        <Grid item xs={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={10} md={7}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={'auto'} direction="column"
                                        align="left"
                                        style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Typography variant='subtitle1' >{userData?.username}</Typography>       
                                        </Grid>
                                        <Grid item xs={5} direction="column"
                                        align="left"
                                        style={{ display: "flex", justifyContent: "flex-end" }}>
                                            {auth.user?.username === userData?.username
                                            ?
                                            <Button component={Link} to={'/setting'} 
                                                style={{textTransform: 'none', color: 'black', border: '1px solid #ccc'}}
                                                variant="outlined" size="small"
                                                color="success">
                                                <Typography variant='body2'>
                                                    Edit profile
                                                </Typography>      
                                            </Button>
                                            :
                                            <ProfileFollowBtn user={userData} page={"profile"}/>
                                            }
                                        </Grid>
                                        {auth.user?.username === userData?.username && <Grid item xs={'auto'} direction="column"
                                        component={Link} to={'/setting'}
                                        align="center"
                                        style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <SettingsIcon sx={{fontSize: '30px', color: 'black'}}/>
                                        </Grid>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={10} md={8} lg={7}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <Typography variant='body1' component="div" ><b>{articles.length}</b> articles</Typography>       
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography style={{cursor: "pointer"}} variant='body1' component="div" onClick={handleOpenFollowCard}><b>{userData? userData.followers?.length : 0}</b> followers</Typography>       
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography style={{cursor: "pointer"}} variant='body1' component="div" onClick={handleOpenFollowingCard}><b>{userData? userData.following?.length : 0}</b> followings</Typography>       
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={0.25}>
                                        <Grid item xs={12}>
                                            <Typography variant='h6' component="div" >{userData?.fullname}</Typography>       
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='subtitle1' component="div" >{userData?.bio}</Typography>       
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                {/* <Divider variant="middle" 
                style={{position: 'relative', top: '4vh'}}/> */}
            </div>
            <Container maxWidth="lg" style={{marginTop: '10vh'}} >
                <Box sx={{  maxWidth: '100%'}} >
                    <ProfileTab articles={articles} favArticles={favArticles} />
                </Box>
            </Container>

        </div>
    )
}