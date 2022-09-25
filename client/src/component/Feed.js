import React from 'react'
import NewArticlePreview from './home/NewArticlePreview';
import { Box, Typography } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

export default function Feed(props){
    const {articles} = props
    return(
        <> {articles.length > 0 ? 
                (articles.map((article, index) => (
                    <NewArticlePreview article = {article} key={index}/>
                )))
            :
            <Box marginTop={10}>
                <PhotoCameraOutlinedIcon  sx={{ fontSize: 60 }} style={{position: "relative", left: "50%", transform: "translateX(-50%)"}}/>
                
                <Typography variant="h3" textAlign={"center"}>No Articles Yet</Typography>
            </Box>
            }
        </>
        
    )

}