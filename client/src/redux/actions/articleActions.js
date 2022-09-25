import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from '../actions/notifyAction'

export const ARTICLE_TYPES = {
    CREATE_ARTICLE: 'CREATE_ARTICLE',
    LOADING_ARTICLE: 'LOADING_ARTICLE',
    GET_ARTICLES: 'GET_ARTICLES',
    GET_FOLLOWED_ARTICLES: 'GET_FOLLOWED_ARTICLES',
    UPDATE_ARTICLE: 'UPDATE_ARTICLE',
    GET_ARTICLE: 'GET_ARTICLE',
    DELETE_ARTICLE: 'DELETE_ARTICLE',
    GET_TAGLIST: 'GET_TAGLIST',
    GET_TAG_ARTICLES: 'GET_TAG_ARTICLES',
    OPEN_POPUP_ARTICLE: 'OPEN_POPUP_ARTICLE',
    SET_ON_REPLY:  'SET_ON_REPLY',
    GET_SEARCH_ARTICLE_RESULT: 'GET_SEARCH_ARTICLE_RESULT'
}

export const createArticle = ({title, description,body,taglist, cloudImage ,auth, socket}) => async (dispatch) => {
    // let media = []
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        // if(cloudImage.length > 0) media = await imageUpload(cloudImage)
        const res = await postDataAPI('articles', { title, description,body,taglist, cloudImage }, auth.token)
        
        dispatch({ 
            type: ARTICLE_TYPES.CREATE_ARTICLE, 
            payload: {...res.data.newArticle, user: auth.user} 
        })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg, loading: false} })

        // Notify
        const msg = {
            id: res.data.newArticle._id,
            text: 'added a new article.',
            recipients: res.data.newArticle.author.followers,
            url: `/article/${res.data.newArticle.slug}`,
            content: '',
            image: cloudImage,
            avatar: auth.user.image
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response}
        })
    }
}

export const getArticles = () => async (dispatch) => {
    try {
        // dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: true })
        const res = await getDataAPI('articles')
        dispatch({
            type: ARTICLE_TYPES.GET_ARTICLES,
            payload: {...res.data}
        })

        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getFollowedArticles = (token, offset) => async (dispatch) => {
    try {
        // dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: true })
        const res = await getDataAPI(`articles/feed/?offset=${offset}`, token)
        dispatch({
            type: ARTICLE_TYPES.GET_FOLLOWED_ARTICLES,
            payload: {...res.data}
        })

        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getTagArticle = (tag, offset) => async (dispatch) => {
    try {
        // dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: true })
        const res = await getDataAPI(`articles/?tag=${tag}&&offset=${offset}`)
        dispatch({
            type: ARTICLE_TYPES.GET_TAG_ARTICLES,
            payload: {...res.data}
        })

        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getPaginationArticle = (offset) => async (dispatch) => {
    try {
        // dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: true })
        const res = await getDataAPI(`articles/?offset=${offset}`)
        dispatch({
            type: ARTICLE_TYPES.GET_ARTICLES,
            payload: {...res.data}
        })

        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}



export const updateArticle = ({title, description,body,taglist, cloudImage, auth, slug, socket}) => async (dispatch) => {
    try {
        
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        // if(imgNewUrl.length > 0) media = await imageUpload(imgNewUrl)

        const res = await patchDataAPI(`article/${slug}`, { 
            title, description,body,taglist, cloudImage
        }, auth.token)
        dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: res.data.newArticle })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
        let msg = res.data.newNotify
        dispatch(removeNotify({msg, auth, socket}))
        dispatch(createNotify({msg, auth, socket}))
        window.location.replace(`/article/${res.data.newArticle.slug}`)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response}
        })
    }
}

export const favouriteArticle = ({article, auth, socket}) => async (dispatch) => {
    const newArticle = {...article, favourites: [...article.favourites, auth.user]}
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle})


    socket.emit('favouriteArticle', newArticle)

    try {
        await patchDataAPI(`article/${article.slug}/favourite`, null, auth.token)

        const msg = {
            id: auth.user._id,
            text: "favourited your article.",
            recipients: [article.author._id],
            url: `/article/${article.slug}`,
            content: '', 
            image: article.image,
            avatar: auth.user.image
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unfavouriteArticle = ({article, auth, socket}) => async (dispatch) => {
    const newArticle = {...article, favourites: article.favourites.filter(favor => favor._id !== auth.user._id  )}
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle})

    socket.emit('unfavouriteArticle', newArticle)

    try {
        await patchDataAPI(`article/${article.slug}/unfavourite`, null, auth.token)

        const msg = {
            id: auth.user._id,
            text: "favourited your article",
            recipients: [article.author._id],
            url: `/article/${article.slug}`,
        }

        // Notify
        // const msg = {
        //     id: auth.user._id,
        //     text: 'like your post.',
        //     recipients: [post.user._id],
        //     url: `/post/${post._id}`,
        // }
        dispatch(removeNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getArticle = ({detailArticle, slug}) => async (dispatch) => {
    if(detailArticle.every(article => article.slug !== slug)){
        try {
            const res = await getDataAPI(`article/${slug}`)
            dispatch({ type: ARTICLE_TYPES.GET_ARTICLE, payload: res.data.article })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deleteArticle = ({article, auth, socket}) => async (dispatch) => {
    dispatch({ type: ARTICLE_TYPES.DELETE_ARTICLE, payload: article })

    try {
        const res = await deleteDataAPI(`article/${article.slug}`, auth.token)

        // Notify
        const msg = {
            id: article._id,
            text: 'added a new article.',
            recipients: res.data.newArticle.author.followers,
            url: `/article/${article.slug}`,
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getTaglist = () => async (dispatch) => {
    try {
        const res = await getDataAPI('tags')
        dispatch({
            type: ARTICLE_TYPES.GET_TAGLIST,
            payload: {...res.data}
        })

        dispatch({ type: ARTICLE_TYPES.LOADING_ARTICLE, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}
