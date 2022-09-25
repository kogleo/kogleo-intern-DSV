import { ARTICLE_TYPES } from '../actions/articleActions'
import { EditData, DeleteData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    articles: [],
    followedArticles: [],
    tagArticles: [],
    result: 0,
    followedArticlesCount: 0,
    tagArticlesCount: 0,
    page: 2, 
    tags: [],
    openPopupArticle: false,
    onReply: false,
    searchArticleResult: []
}

const articleReducer = (state = initialState, action) => {
    switch (action.type){
        case ARTICLE_TYPES.CREATE_ARTICLE:
            return {
                ...state,
                articles: [action.payload, ...state.articles]
            };
        case ARTICLE_TYPES.LOADING_ARTICLE:
            return {
                ...state,
                loading: action.payload
            };
        case ARTICLE_TYPES.GET_ARTICLES:
            return {
                ...state,
                articles: action.payload.articles,
                result: action.payload.articlesCount,
                page: action.payload.page
            };
        case ARTICLE_TYPES.GET_FOLLOWED_ARTICLES:
            return {
                ...state,
                followedArticles: action.payload.articles,
                followedArticlesCount: action.payload.articlesCount
            };
        case ARTICLE_TYPES.UPDATE_ARTICLE:
            return {
                ...state,
                articles: EditData(state.articles, action.payload._id, action.payload),
                followedArticles: EditData(state.articles, action.payload._id, action.payload),
            };
        case ARTICLE_TYPES.DELETE_ARTICLE:
            return {
                ...state,
                articles: DeleteData(state.articles, action.payload._id)
            };
        case ARTICLE_TYPES.GET_TAGLIST:
            return {
                ...state,
                tags: action.payload.tags
            };
        case ARTICLE_TYPES.GET_TAG_ARTICLES:
                return {
                    ...state,
                    tagArticles: action.payload.articles,
                    tagArticlesCount: action.payload.articlesCount
                };
        case ARTICLE_TYPES.OPEN_POPUP_ARTICLE:
            return {
                ...state,
                openPopupArticle: action.payload.openPopupArticle,
            };
        case ARTICLE_TYPES.SET_ON_REPLY:
            return {
                ...state,
                onReply: action.payload.onReply,
            };
        // case ARTICLE_TYPES.GET_SEARCH_ARTICLE_RESULT:
        //     return {
        //         ...state,
        //         searchArticleResult: action.payload.result,
        //     };
        default:
            return state;
    }
}

export default articleReducer