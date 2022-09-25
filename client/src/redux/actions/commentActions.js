import { GLOBALTYPES, EditData, DeleteData } from './globalTypes'
import { ARTICLE_TYPES } from './articleActions'
import { postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from '../actions/notifyAction'


export const createComment = ({article, newComment, auth, socket}) => async (dispatch) => {

    const newArticle = {...article, comments: [...article.comments, newComment]}
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle })

    try {
        const data = {...newComment, articleId: article._id, articleUserId: article.author._id}
        const res = await postDataAPI('comment', data, auth.token)

        const newData = {...res.data.newComment, user: auth.user}
        const newArticle = {...article, comments: [...article.comments, newData]}
        dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle })

        // Socket
        socket.emit('createComment', newArticle)

        // Notify
        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned you in a comment:' : 'commented:',
            recipients: newComment.reply ? [newComment.tag._id] : [article.author._id],
            url: `/article/${article.slug}`,
            content: res.data.newComment.content, 
            image: article.image,
            avatar: newComment.user.image
        }

        dispatch(createNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const updateComment = ({comment, post, content, auth}) => async (dispatch) => {
    const newComments = EditData(post.comments, comment._id, {...comment, content})
    const newPost = {...post, comments: newComments}
    
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newPost })
    try {
        patchDataAPI(`comment/${comment._id}`, { content }, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const favouriteComment = ({comment, article, auth}) => async (dispatch) => {
    const newComment = {...comment, likes: [...comment.likes, auth.user]}

    const newComments = EditData(article.comments, comment._id, newComment)

    const newArticle = {...article, comments: newComments}
    
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle })

    try {
        await patchDataAPI(`comment/${comment._id}/favourite`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const unFavouriteComment = ({comment, article, auth}) => async (dispatch) => {

    const newComment = {...comment, likes: DeleteData(comment.likes, auth.user._id)}

    const newComments = EditData(article.comments, comment._id, newComment)

    const newArticle = {...article, comments: newComments}
    
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle })

    try {
        await patchDataAPI(`comment/${comment._id}/unfavourite`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const deleteComment = ({article, comment, auth, socket}) => async (dispatch) => {
    const deleteArr = [...article.comments.filter(cm => cm.reply === comment._id), comment]
    
    const newArticle = {
        ...article,
        comments: article.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
    }
    dispatch({ type: ARTICLE_TYPES.UPDATE_ARTICLE, payload: newArticle })

    socket.emit('deleteComment', newArticle)
    try {
       deleteArr.forEach(item => {
            deleteDataAPI(`comment/${item._id}`, auth.token)

            const msg = {
                id: item._id,
                text: comment.reply ? 'mentioned you in a comment:' : 'has commented on your post:',
                recipients: comment.reply ? [comment.tag._id] : [article.author._id],
                url: `/article/${article.slug}`,
            }
    
            dispatch(removeNotify({msg, auth, socket}))
       })
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response} })
    }

}