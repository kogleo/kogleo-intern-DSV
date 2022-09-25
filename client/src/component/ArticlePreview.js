import { Box, Grid, Typography, Avatar, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ArticlePreview(props){
    const {article} = props

    return (
        <div className="article-preview">
            <Box sx={{ flexGrow: 1 }} >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={0} align='left'>
                            <Grid item xs={1}>
                                <Avatar alt={article.author.username} src={article.author.image}/>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12} align='left'>
                                        <Typography>{article.author.username}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {article.createdAt.slice(0, 10)}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                
                            </Grid>
                            <Grid item xs={2}>
                            <Button variant="contained" endIcon={<FavoriteBorderIcon/>}>
                                {article.favourites.length}
                            </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} align='left'>
                        <Typography>{article.title}</Typography>
                    </Grid>
                    <Grid item xs={12} align='left'>
                        <Typography>{article.body}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={0}>
                            <Grid item xs={4} >
                                <Link to={`/article/${article._id}`}>Load More...</Link>
                            </Grid>
                            <Grid item xs={8} align='right'>
                                {article.taglist.map((tag, index) => (
                                    <Chip key={index} label={tag} />
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}