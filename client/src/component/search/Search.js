import React, { useState } from 'react'
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled} from '@mui/material/styles';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { useSelector } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData';
import SearchDropdown from './SearchDropdown';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgb(239, 239, 239)',
    '&:hover': {
      backgroundColor: 'rgb(239, 239, 239)',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

export default function SearchBox() {
    const [search, setSearch] = useState('')
    const [usersData, setUsersData] = useState([])
    const [articlesData, setArticlesData]= useState([])
    const [load, setLoad] = useState(false)
    const {auth} = useSelector(state=>state)
    // const handleEnter = async (e) => {
    //     if (e.keyCode === 13 && !e.shiftKey){
    //         e.preventDefault()
    //         if(!search) return;
    //         try {
    //             setLoad(true)
    //             const userResults = await getDataAPI(`search?username=${search}`, auth.token)
    //             const articleResult = await getDataAPI(`articles/search?title=${search}`, auth.token)

    //             setUsersData(userResults.data.users)
    //             setArticlesData(articleResult)
    //             setLoad(false)
    //         } catch (err) {
    //             dispatch({
    //                 type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
    //             })
    //         }
    //     }
    // }
    const handleChangeValue = async (e) => {
        let searchValue = e.target.value
        setSearch(searchValue)
        setLoad(true)
        const userResults = await getDataAPI(`search?username=${searchValue}`, auth.token)
        const articleResult = await getDataAPI(`articles/search?title=${searchValue}`, auth.token)
        setUsersData(userResults.data.users)
        setArticlesData(articleResult.data.articles)
        setLoad(false)
    }
    return (
      <Box> 
        <Search component="form">
          <SearchIconWrapper>
              <SearchIcon style={{color: 'rgb(142, 142, 142)'}}/>
          </SearchIconWrapper>
          <StyledInputBase 
            endAdornment={search && 
                        <IconButton onClick={(e)=>setSearch('')}>
                            <HighlightOffRoundedIcon style={{color: '#ccc'}} fontSize="small"/>
                        </IconButton> }
            placeholder="Search…" 
            value={search}
            onChange={handleChangeValue}
            // onKeyDown={(e)=>handleEnter(e)}
            inputProps={{ 'aria-label': 'search' }}
          />
          
            
        </Search>
        {<SearchDropdown articles={articlesData} users={usersData} keyword={search}/>}
      </Box>
      
  );
}

