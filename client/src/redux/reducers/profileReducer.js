import { PROFILE_TYPES } from '../actions/profileAction'
import { EditData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    usernames: [],
    users: [],
    articles: [],
    favouritedArticles: [], 
    curUser: [],
    openCard: false
}

const profileReducer = (state = initialState, action) => {
    switch (action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case PROFILE_TYPES.GET_USER:
            return {
                ...state,
                users: [...state.users, action.payload.user],
                curUser: action.payload.user
            };
        case PROFILE_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload),
                curUser: {...state.curUser, followers: action.payload.followers}
            };
        case PROFILE_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload),
                curUser: {...state.curUser, followers: action.payload.followers}
            };
        case PROFILE_TYPES.GET_USERNAME:
            return {
                ...state,
                usernames: [...state.usernames, action.payload]
            };
        case PROFILE_TYPES.GET_ARTICLES:
            return {
                ...state,
                articles: action.payload.articles
            };

        case PROFILE_TYPES.GET_FAVOURITED_ARTICLES:
            return {
                ...state,
                favouritedArticles: action.payload.articles
            };
        case PROFILE_TYPES.UPDATE_ARTICLE:
            return {
                ...state,
                articles: EditData(state.articles, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.OPEN_USER_CARD:
            return {
                ...state,
                openCard: action.payload.openCard
            };
        default:
            return state;
    }
}

export default profileReducer