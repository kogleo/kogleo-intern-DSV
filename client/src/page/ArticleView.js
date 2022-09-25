import HeaderBar from "../component/Header";
import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getArticle } from '../redux/actions/articleActions'
import NewArticleDetail from "../component/NewArticleDetail";
import PopupArticle from "../component/article/PopupArticle";

export default function ArticleView(){
    const { slug } = useParams()
    const { auth, detailArticle, feedArticle} = useSelector(state => state)

    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(getArticle({detailArticle, slug}))

    },[auth, dispatch, slug, detailArticle])


    return(      
        <div className="article-page">
            {feedArticle.openPopupArticle && 
                <PopupArticle slug={slug}
                />
            }
            <HeaderBar/>
            <NewArticleDetail article={detailArticle.filter(article=> article.slug === slug)[0]} auth = {auth}/>
        </div>
    )
}