import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
// import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import feedArticle from './articleReducer'
// import modal from './modalReducer'
import detailArticle from './detailArticleReducer'
// import discover from './discoverReducer'
// import suggestions from './suggestionsReducer'
import socket from './socketReducer'
import notify from './notifyReducer'
// import message from './messageReducer'
// import online from './onlineReducer'
// import call from './callReducer'
// import peer from './peerReducer'


export default combineReducers({
    auth,
    alert,
    // theme,
    profile,
    status,
    feedArticle,
    // modal,
    detailArticle,
    // discover,
    // suggestions,
    socket,
    notify,
    // message,
    // online,
    // call,
    // peer
})