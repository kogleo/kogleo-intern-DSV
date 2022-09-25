import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,} from '@mui/material';


import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { logout } from '../redux/actions/authAction'
import logo from '../assets/img/lion_logo.png'
import '../assets/css/header.css'

import SearchBox from './search/Search';
import NotifyButton from './NotifyButton';


export function ResponsiveHeaderBar({page}){
  const dispatch = useDispatch()
  const { auth} = useSelector(state => state)
  var isAuth = auth.isAuth
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const  pages= ['Home', 'Create Article', 'Notify' ]
  const pageIcons = [
    page === "home"? <HomeRoundedIcon sx={{ fontSize: 30}} className='home-icon'/> : <HomeRoundedIcon sx={{ fontSize: 30}} style={{stroke: 'black', strokeWidth: '1.5px', color: 'white'}} className='home-icon'/>
    , page === "editor" ? <AddBoxRoundedIcon className='add-icon' sx={{ fontSize: 30 }}/> : <AddBoxOutlinedIcon className='add-icon' sx={{ fontSize: 30 }}/>
    , <NotifyButton/>
  ]
  const pageLinks = ['/', '/articleconfig', '']

  const nonLoginPages = ['Sign In', 'Sign Up']
  const nonLoginPageIcons = [<LoginIcon/>, <VpnKeyIcon/> ]
  const nonLoginPageLinks = ['/login', '/register']
  const settings = ['Profile', 'Setting', 'Log Out'];
  const settingLinks = ['/profile', '/setting', '']

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    dispatch(logout())
  }

  return (
    <AppBar position="static" color='transparent' className='app-bar'>
      <Container maxWidth="md">
        <Toolbar variant="dense" className='logo' disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 , color:'black'}}>
            <img alt={"logo"} src={logo} style={{objectFit: 'contain'}}  className='logo-img'/>
          </Box>
          &nbsp;
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={'/'}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'instagram',
              fontSize: '2rem',
              // fontWeight: 700,
              // letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Kogleo
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              disableRipple
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {isAuth ? pages.map((page, index) => (
                <Link to={pageLinks[index]} style={{textDecoration: 'none'}} key={index}>
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    {pageIcons[index]}
                    &nbsp;
                    <Typography key={index} textAlign="center">{page}</Typography>
                  </MenuItem>
                </Link>
              ))
            :
            nonLoginPages.map((page, index) => (
              <Link to={nonLoginPageLinks[index]} style={{textDecoration: 'none'}} key={index}>
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  {nonLoginPageIcons[index]}
                  &nbsp;
                  <Typography key={index} textAlign="center" color='black'>{page} </Typography>
                </MenuItem>
              </Link>
            ))
            }
            </Menu>
          </Box>
          <SearchBox className="search"/>
          &nbsp;
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'instagram',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Kogleo
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },
                  justifyContent: 'flex-end' }}>
          
            {isAuth ? pages.map((page, index) => (
              <Link to={pageLinks[index]} style={{textDecoration: 'none'}} key={index}>
                <Button
                  disableRipple
                  disableTouchRipple
                  key={index}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 1, color: 'black'}}                  
                >
                  {/* {page} */}
                  {pageIcons[index]}
                </Button>
              </Link>
            ))
          :
            nonLoginPages.map((page, index) => (
              <Link to={nonLoginPageLinks[index]} style={{textDecoration: 'none'}} key={index}>
                <Button
                  key={index}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  {/* {page} */}
                  {nonLoginPages[index]}
                </Button>
              </Link>
            ))
          }
          </Box>

          {isAuth && <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton disableRipple onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                <Avatar className='user-avatar' alt={auth.user ? auth.user.username : '' } src={auth.user ? auth.user.image : ''} />
              </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ mt: '40px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              style={{overflowY: 'visible', overflowX: 'visible'}}
            >
              <Box style={{
                backgroundColor: 'white',
                border: '1px solid rgb(255,255,255)',
                boxShadow: '0.5px 0.5px rgba(0,0,0,.0975)',
                height: '14px',
                width: '14px',
                transform: 'rotate(-135deg) translateX(-50%)',
                position: 'absolute',
                transformOrigin: 'center left',
                top: '-7px',
                left: '80%',
                zIndex: '200'
              }}></Box>
              {settings.map((setting, index) => (
                <MenuItem key={index} 
                 onClick={handleCloseUserMenu}>
                  {index === 2 ? 
                  <Button 
                    style={{textTransform: 'none', color: 'red'}}
                    disableRipple 
                    onClick={handleLogOut} 
                    key={index}>
                      {setting}
                  </Button>
                  :
                  (index === 1 ?
                  <Button 
                    style={{textTransform: 'none'}}
                    startIcon={<SettingsRoundedIcon/>}
                    disableRipple 
                    component={Link} 
                    to={settingLinks[index]} 
                    key={index}>
                    {setting}
                  </Button>
                  :
                  <Button 
                    style={{textTransform: 'none'}}
                    startIcon={<AccountCircleOutlinedIcon/>}
                    disableRipple 
                    component={Link} 
                    to={`/profile/${auth.user.username}`} 
                    key={index}>
                      {setting}
                  </Button>
                  )  
                }
                  
                </MenuItem>
              ))}
            </Menu>
          </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export function NonLoginHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <SearchBox/>
          <Button color="black">Sign In</Button>
          <Button color="black">Sign Up</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default function HeaderBar({page}) {

  return (
    <div className='header-bar'>
      <ResponsiveHeaderBar page={page}/>
    </div>
  );
}
