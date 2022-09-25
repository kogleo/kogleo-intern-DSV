import { Grid, ImageList, ImageListItem, ImageListItemBar, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

export default function ArticleGridDisplay({articles}){
    return(
        <Grid container spacing={0}>
            {articles.map((article, index)=>(
                <Link to={`/article/${article.slug}`}>
                    <Grid item key={index} xs={3}>
                        <ImageListItem key={article._id}>
                            <img
                            src={article.image}
                            srcSet={article.image}
                            alt={article.title}
                            loading="lazy"
                            style={{width: {xs: "200px", md: "300px"}, height: {xs: "200px", md: "300px"}}}
                            />
                            <ImageListItemBar
                            sx={{width: {xs: 200, md: 300}, height: 1,
                                background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                            }}
                            position="center"
                            actionIcon={
                                <Grid container columnSpacing={1}>
                                    <Grid item xs={6} >
                                        <IconButton
                                            sx={{ color: 'white' }}
                                            aria-label=''
                                            >
                                                <FavoriteIcon/>
                                                &nbsp;
                                                <Typography>{article.favourites.length}</Typography>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <IconButton
                                            sx={{ color: 'white' }}
                                            aria-label=''
                                            >
                                                <ModeCommentIcon/>
                                                &nbsp;
                                            <Typography>{article.comments.length}</Typography>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                
                                
                            }
                            actionPosition="center"
                            />
                        </ImageListItem>
                    </Grid>
                </Link>
            ))}
        </Grid>
    )
}