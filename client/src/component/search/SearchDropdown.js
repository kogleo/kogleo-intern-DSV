import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import {Typography, Box, Grid,Avatar, ClickAwayListener} from "@mui/material";
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import '../../assets/css/search.css'

export default function SearchDropdown({articles, users, keyword}){
    const [isOpen, setIsOpen] = useState(false)
    const clickAwayHandler =()=>{
        setIsOpen(false)
    }
    useEffect(()=>{
        setIsOpen(keyword)
    }, [keyword])
    return(
        <>
        {isOpen && 
        <ClickAwayListener onClickAway={clickAwayHandler}> 
        <div className="search-dropdown" 
            style={{
                position: 'absolute',
                top: '58px', 
                width: '375px', 
                zIndex: 100, 
                // overflowY: 'scroll',
            }}>
            <Box style={{
                backgroundColor: 'white',
                border: '1px solid rgb(255, 255, 255)',
                boxShadow: '0.5px 0.5px rgba(0,0,0,.0975)',
                height: '14px',
                width: '14px',
                transform: 'rotate(-135deg)',
                position: 'absolute',
                top: '-6px',
                right: '50%',
                zIndex: '200'
            }}>
            </Box>
            <Box style={{
                overflowY: 'scroll',
                borderRadius: '6px',
                boxShadow: '0 0 5px 1px rgba(0,0,0,.0975)',
                width: '375px', 
                height: '40vh',
                position: 'absolute', 
                backgroundColor: 'white'}}
                className='search-dropdown-box'>
                <Grid container className='search-dropdown-result' rowSpacing={2} style={{marginTop: '1vh'}}>
                    <Grid item className='article-result' xs={12} marginBottom={1.5} onClick={()=>setIsOpen(false)}>
                        <Grid container columnSpacing={0}>
                            <Grid item xs={2} container justifyContent={'center'} alignItems='center' >
                                <Avatar>
                                    <ArticleRoundedIcon/>
                                </Avatar>
                            </Grid>
                            <Grid item xs={10}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        #{keyword}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Link to={`/articles/${keyword}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                            <Typography sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"><b>{articles.length}</b> articles related
                                            </Typography>
                                        </Link>
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                    </Grid>
                    {users.map((user, index) => (
                        <Grid item key={user.username} className={user.username} xs={12} marginBottom={0}>
                            <Link to={`/profile/${user.username}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                <Grid container columnSpacing={0}>
                                    <Grid item xs={2} container justifyContent={'center'} alignItems='center'>
                                        <Avatar alt={user.username} src={user.image} variant='circular'/>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Grid container>
                                            <Grid item xs={12} >
                                                <Typography variant="body1"><b>{user.username}</b></Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body1">{user.fullname}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Link>
                        </Grid>
                        
                    ))}
                    
                </Grid>
            </Box>
        </div>
        </ClickAwayListener>
        }
        </>
        
    )
}