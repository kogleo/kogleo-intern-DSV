import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import HeaderBar from '../Header';
import {Typography, Box,Divider, Container } from "@mui/material";
import { getDataAPI } from '../../utils/fetchData';
import { useSelector } from 'react-redux';
import ProfileFeed from '../ProfileFeed';

export default function SearchDefault(){
    const {keyword} = useParams()
    const [articlesData, setArticlesData]= useState([])
    const [load, setLoad] = useState(false)

    const {auth} = useSelector(state=>state)
    useEffect(()=>{
            setLoad(true)
            const fetchData = async () => {
                const data = await getDataAPI(`articles/search?title=${keyword}`, auth.token);
                setArticlesData(data.data.articles)
            }
            fetchData()
            setLoad(false) 
    }, [auth.token, keyword])
    return(
        <div>
            <HeaderBar/>
            <Container className='search-result-page' maxWidth="lg" style={{marginTop: '5vh'}}>
                <Box style={{width: '100%'}}>
                    <Typography variant='h3'>Result for "{keyword}"</Typography>
                </Box>
                <Divider/>
                <ProfileFeed articles={articlesData}/>


            </Container>
        </div>
    )
}