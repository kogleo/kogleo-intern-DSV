import { useDispatch } from "react-redux";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import '../assets/css/profile/userCard.css'
import { ClickAwayListener } from "@mui/material";
import { PROFILE_TYPES } from "../redux/actions/profileAction";
import ProfileFollowBtn from "./profile/profileFollowBtn";

export default function UserCard({users, typeCard, profile, auth}){

    const dispatch = useDispatch()
    const clickAwayHandler = () => {
        dispatch({type: PROFILE_TYPES.OPEN_USER_CARD, payload: {...profile, openCard: false}})
    }
    return(
        <div className="user-card">
            <Box className="cover"></Box>
            <ClickAwayListener onClickAway={clickAwayHandler}>
                <Box className="list-user">
                    <Typography style={{borderBottom: '1px solid #ccc', padding:'0.1vw 0.1vh'}}
                    variant="h6" textAlign={'center'}>{typeCard}</Typography>
                    <Box className="grid-user">
                        <Grid container paddingLeft={2} paddingTop={2} rowSpacing={3}> 
                            {users.map((user, index)=>(
                                <Grid key={index} xs={12} item >
                                    <Grid container columnSpacing={1}>
                                        <Grid item xs={9}>
                                            <Grid container columnSpacing={{xs: 6, md: 6}}>
                                                <Grid item xs={1.5}>
                                                    <Avatar alt={user.username} src={user.image} />
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant="body2"><b>{user.username}</b></Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="body2" style={{color: 'rgb(142,142,142)'}}>{user.fullname}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2.5}>
                                            <Grid container justifyContent="flex-end">
                                                {user.username !== auth.user.username  && <ProfileFollowBtn user={user}/>}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>    
                            ))}
                        </Grid>
                    </Box>
                    
                </Box>
            </ClickAwayListener>
            
        </div>
    )
}