import { ARTICLE_TYPES } from '../actions/articleActions'
import { EditData } from '../actions/globalTypes'

const detailArticleReducer = (state = [], action) => {
    switch (action.type){
        case ARTICLE_TYPES.GET_ARTICLE:
            return [...state, action.payload]
        case ARTICLE_TYPES.UPDATE_ARTICLE:
            return EditData(state, action.payload._id, action.payload)
        default:
            return state;
    }
}


export default detailArticleReducer