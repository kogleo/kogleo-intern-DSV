import React, {useEffect, useState} from 'react';
import HeaderBar from '../component/Header';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { Container } from '@mui/material';

import PropTypes from 'prop-types';
import Feed from '../component/Feed';
import { useSelector, useDispatch } from 'react-redux'
import { getTagArticle, getPaginationArticle, getFollowedArticles } from '../redux/actions/articleActions';

// import css
import '../assets/css/home/home.css'
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
          <Box sx={{ p: 3 }}>
            {children}
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

export default function Home(){
    const {feedArticle} = useSelector(state => state)
    const dispatch = useDispatch()
    const [tagTab, setTagTab] = useState('')
    const [value, setValue] = useState(0);
    const {auth} = useSelector(state => state)
    const [showTag, setShowTag] = useState([])
    useEffect(() => {
        document.title="Kogleo"
    }, [])
    useEffect(()=>{
        setShowTag(feedArticle.tags.slice(0,10))
    },[feedArticle.tags])
    const [tagPage, setTagPage] = useState(1);

    const handleTagClick = (e) => {
        dispatch(getTagArticle(e.target.textContent))
        setTagTab(e.target.textContent)
        if (auth.isAuth){
            setValue(2)
        }
        else{
            setValue(1)
        }
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTabClick = () => {
        setTagTab('')
    }

    const handleChangePage = (e, value) => {
        dispatch(getPaginationArticle((value-1)*5))
    }

    const handleChangeFollowingTab = (e, value) => {
        dispatch(getFollowedArticles(auth.token, ((value-1)*5)))
    }

    const handleChangeTagTab = (e, value) => {
        dispatch(getTagArticle(tagTab, ((value-1)*5)))
    }

    const handleChangeTagTable = (e, newPage) => {
        setTagPage(newPage);
        setShowTag(feedArticle.tags.slice((newPage-1)*10, (newPage-1)*10+10 ))
    }
    return(
        <div className="home-page">
            <ThemeProvider theme={theme}>
                <HeaderBar page={'home'}/>  
                <Container style={{maxWidth: '70vw'}} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} className='banner'>
                            <Typography variant='h1' textAlign='center' fontFamily={'instagram'} letterSpacing={10} ><b>Kogleo</b></Typography>
                            <Typography variant='h6' textAlign='center'>A place to share your knowledge.</Typography>
                        </Grid>
                        <Grid item xs={12} className='content'>
                            <Grid container columnSpacing={5}>
                                <Grid item xs={7} className='feeds'>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label="secondary tabs example" centered indicatorColor='secondary' textColor='secondary'>
                                            {auth.isAuth && <Tab iconPosition="start" icon={<PersonIcon/>} label="Your Feed" {...a11yProps(0)} onClick={handleTabClick} style={{textTransform: 'none'}}/>}
                                            { <Tab iconPosition="start" icon={<PublicIcon/>} label="Global Feed" {...a11yProps(1)} onClick={handleTabClick} style={{textTransform: 'none'}}/>}
                                            { tagTab && <Tab label={`#`+ tagTab} {...a11yProps(2)} style={{textTransform: 'none'}}/>}
                                        </Tabs>
                                    </Box>
                                    {auth.isAuth && <TabPanel value={value} index={0}>
                                        <Feed articles={feedArticle.followedArticles}/>
                                        <Pagination 
                                            count={(isNaN(Math.ceil(feedArticle.followedArticlesCount/5)) ? 0 : Math.ceil(feedArticle.followedArticlesCount/5))} 
                                            color="primary" onChange={handleChangeFollowingTab}/>
                                    </TabPanel>}
                                    <TabPanel value={value} index={auth.isAuth ? 1 : 0}>
                                        <Feed articles={feedArticle.articles}/>
                                        <Pagination 
                                        count={(isNaN(Math.ceil(feedArticle.result/5)) ? 0 : Math.ceil(feedArticle.result/5))} 
                                        color="primary" onChange={handleChangePage}/>
                                    </TabPanel>
                                    
                                    {
                                        tagTab && 
                                        <TabPanel value={value} index={auth.isAuth ? 2 : 1}>
                                            <Feed articles={feedArticle.tagArticles}/>
                                            <Pagination 
                                            count={(isNaN(Math.ceil(feedArticle.tagArticlesCount/5)) ? 0 : Math.ceil(feedArticle.tagArticlesCount/5))} 
                                            color="primary" onChange={handleChangeTagTab}/>
                                        </TabPanel>  
                                    }

                                    
                                </Box>
                                </Grid>
                                <Grid item xs={5} className='tags'>
                                    {/* <Typography variant='h5' textAlign='center'> Topic Ranking </Typography> */}
                                    <Box style={{backgroundColor: 'white', padding:'5px', border: '1px solid #ccc', borderRadius: "10px"}} >
                                        <Typography variant='body2' textAlign='center' textTransform="uppercase"> Leaderboard </Typography>
                                        <Typography fontWeight={1000} variant='h5' textAlign='center' textTransform="uppercase" marginTop={"1vh"}> Most popular topic </Typography>
                                    </Box>
                                    <TableContainer component={Paper} style={{marginTop: '1vh'}}>
                                        <Table  aria-label="simple table">
                                            <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Rank</TableCell>
                                                <TableCell align="left">Tags</TableCell>
                                                <TableCell align="center">Articles</TableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {showTag.map((tag, index) => (
                                                <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    {(index === 0 && tag.Name === feedArticle.tags[index].Name) ?
                                                    <>
                                                        <TableCell component="th" scope="row" align="center">
                                                            <Typography variant='h4'>#1</Typography>
                                                        </TableCell>
                                                        <TableCell align="left" style={{cursor: 'pointer'}} onClick={handleTagClick}>
                                                            <Typography variant='h4'>{tag.Name}</Typography>
                                                        </TableCell>
                                                        <TableCell align="center" ><Typography variant='h4'>{tag.Count}</Typography></TableCell>
                                                    </>
                                                    :
                                                    <>
                                                    <TableCell component="th" scope="row" align="center">
                                                        #{(index+1)+(tagPage-1)*10}
                                                    </TableCell>
                                                    <TableCell align="left" style={{cursor: 'pointer'}} onClick={handleTagClick}>
                                                        {tag.Name}
                                                    </TableCell>
                                                    <TableCell align="center" >{tag.Count}</TableCell>
                                                    </>
                                                    }
                                                </TableRow> 
                                            ))}
                                            </TableBody>
                                        </Table>
                                        <Pagination 
                                        style={{padding: '1vh'}}
                                        count={(isNaN(Math.ceil(feedArticle.tags.length/10)) ? 0 : Math.ceil(feedArticle.tags.length/10))} 
                                        color="primary" onChange={handleChangeTagTable}/>
                                    </TableContainer>
                                    
                                </Grid>
                            </Grid>
                        </Grid>
                        
                    </Grid>
                    
                </Container>  
            </ThemeProvider>
            

        </div>
    )
}