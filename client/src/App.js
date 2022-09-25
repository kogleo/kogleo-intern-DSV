
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Home from './page/Home';
import Profile from './page/Profile';
import Setting from './page/Setting';
import SearchResult from './component/search/SearchResults'
import ArticleConfig from './page/ArticleConfig';
import { refreshToken } from './redux/actions/authAction'
import NotFound from './page/NotFound';

import { useSelector, useDispatch } from 'react-redux'
import { getArticles, getFollowedArticles, getTaglist } from './redux/actions/articleActions';
import { getNotifies } from './redux/actions/notifyAction';
import { useEffect } from 'react'
import ArticleView from './page/ArticleView';
import CustomizeAlert from './component/Alert';

import  io  from "socket.io-client";
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'
import Peer from 'peerjs'


// const END_POINT = "http://localhost:5000"
const END_POINT = "https://chaunhm.api.internship.designveloper.com"
function App() {
  const { auth, alert } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())
    const socket = io(END_POINT)
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    dispatch(getArticles())
    dispatch(getTaglist())
  },[auth, dispatch])


  useEffect(() => {
    console.log("here")
    if (auth.token){
      dispatch(getFollowedArticles(auth.token))
      dispatch(getNotifies(auth.token))
    }
  },[dispatch, auth.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[alert])

 
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])

  return (
    <div className="App">
      <Router>  
        <CustomizeAlert/>
        {auth.token && <SocketClient />}
        <Routes>
          <Route path="/login" element={<SignIn />} ></Route>
          <Route path="/register" element={<SignUp />} ></Route>
          <Route path="/profile/:username" element={<Profile />} ></Route>
          <Route path="/setting" element={<Setting />} ></Route>
          <Route path="/articleconfig" element={<ArticleConfig />} ></Route>
          <Route path="/articleconfig/:slug" element={<ArticleConfig />} ></Route>
          <Route path="/article/:slug" element={<ArticleView />} ></Route>
          <Route path="/articles/:keyword" element={<SearchResult/>}></Route>
          <Route path="/" element={<Home/>} ></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>
     </Router>
    </div>
  );
}

export default App;
