import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import FavouriteBtn from "./FavouriteBtn";
import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { favouriteArticle, unfavouriteArticle, deleteArticle } from "../redux/actions/articleActions";
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import CommentField from "./CommentField";
import CommentDisplay from "../component/comment/CommentDisplay";

import './article/articleDetail.css'

export default function ArticleDetail(props){

    const {article, auth} = props
    const [isFavourite, setIsFavourite] = useState(false)
    const [loadFavourite, setLoadFavourite] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Favourite

    useEffect(() => {
        if (article){
            if(article.favourites.find(favor => favor._id === auth.user._id)){
                setIsFavourite(true)
            }else{
                setIsFavourite(false)
            }
        }
        
    }, [article ? article.favourites : article, auth.user ? auth.user._id : auth.user])

    const handleFavourite = async () => {
        if(loadFavourite) return;
        
        setLoadFavourite(true)
        await dispatch(favouriteArticle({article, auth}))
        setLoadFavourite(false)
    }

    const handleUnFavourite = async () => {
        if(loadFavourite) return;

        setLoadFavourite(true)
        await dispatch(unfavouriteArticle({article, auth}))
        setLoadFavourite(false)
    }

    const handleEditArticle = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: {...article, onEdit: true}})
    }

    const handleDeleteArticle = () => {
        if(window.confirm("Are you sure want to delete this article?")){
            dispatch(deleteArticle({article, auth}))
            navigate("/")
        }
    }

    return(
        <div>
        {(article&& auth) ?
            <>
            <div class="banner">
                <div class="container">
                    <h1>{article.title}</h1>
                    <div class="article-meta">
                        <a href=""><img src={article.author.image}/></a>
                        <div class="info">
                            <a href="" class="author">{article.author.username}</a>
                            <span class="date">{article.createdAt ? article.createdAt.slice(0, 10) : article.createdAt}</span>
                        </div>
                        {auth.user._id != article.author._id ?
                            <>
                                <FollowBtn user = {article.author}/>
                                &nbsp;&nbsp;
                                <FavouriteBtn isFavourite={isFavourite} 
                                handleFavourite={handleFavourite} 
                                handleUnFavourite={handleUnFavourite}/>
                            </>
                        :
                            <>
                                <Link to={`/articleconfig/${article._id}`} style={{testDecoration: 'none'}}>
                                    <Button class="edit-btn" onClick={handleEditArticle} variant="outlined" color="success"
                                    >
                                        <EditIcon fontSize="small"/>
                                        &nbsp;
                                    <Typography> Edit Article </Typography>
                                    </Button>
                                </Link>
                                &nbsp;&nbsp;
                                <Button class="delete-btn" onClick={handleDeleteArticle} variant="outlined" color="error">
                                    <DeleteIcon fontSize="small"/>
                                    &nbsp;
                                    <Typography> Delete Article </Typography>
                                </Button>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div class="container page">
                <div class="row article-content">
                    <div class="col-md-12">
                        <p>
                           {article.body}
                        </p>
                        {/* <h2 id="introducing-ionic">Introducing RealWorld.</h2>
                        <p>It's a great solution for learning how other frameworks work.</p> */}
                    </div>
                </div>
                <hr/>
                <div class="article-actions">
                    <div class="article-meta">
                        <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg"/></a>
                        <div class="info">
                            <a href="" class="author">Eric Simons</a>
                            <span class="date">January 20th</span>
                        </div>

                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="ion-plus-round"></i>
                            &nbsp;
                            Follow Eric Simons
                        </button>
                        &nbsp;
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="ion-heart"></i>
                            &nbsp;
                            Favorite Post <span class="counter">(29)</span>
                        </button>
                    </div>
                </div>
                <div class="row">

                    <div class="col-xs-12 col-md-8 offset-md-2">

                        {/* <form class="card comment-form">
                            <div class="card-block">
                                <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                            </div>
                            <div class="card-footer">
                                <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img"/>
                                <Button variant="contained" color="primary">Post comment</Button>
                            </div>
                        </form> */}
                        <CommentField article={article}/>
                        <CommentDisplay comments = {article.comments}/>
                    </div>
                </div>
            </div>
            </>
        
        : 
        <>
        </>
        }
        </div>
        
    )
}