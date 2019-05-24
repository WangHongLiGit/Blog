import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
// import loading from "./img/loading.gif"
import App from "./App.js"
//redux引入
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
//路由
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    Feed,
    Container,
    Comment,
    Form,
    Button,
    Loader
} from 'semantic-ui-react'

//reducer文件引入
import reducer from './reducers'



// import Loadable from 'react-loadable';


// function MyLoadingComponent({ error, pastDelay }) {
//     if (error) {
//         return (
//             <div>Error!</div>
//         )
//     } else if (pastDelay) {
//         return (
//             <div class="box" style={{
//                 margin: "200px auto",
//                 height: "50px",
//                 width: "50px",
//                 borderRadius: "10px",
//                 backgroundColor: "rgb(0, 174, 255)",
//                 position: "relative",
//                 overflow: "hidden",
//                 border: "1px solid rgb(0, 174, 255)",
//                 borderTop: "none"
//             }}>
//                 <div class="a" style={{
//                      width: "200px",
//                      height: "200px",
//                     background: "black",
//                      position: "absolute",
//                      left: "-80px",
//                      top: "-180px",
//                      borderRadius: "80px",
//                      animation: "xuanzhuan 5s linear infinite",
//                      zindex: "2"
//                 }}></div>
//                 <div class="b"></div>
//             </div>
//         )
//     } else {
//         return null;
//     }
// }


// //只需给有多个ajax操作，并且页面数据庞大的路由的封装  
// const App = Loadable({
//     loader: () => import('./App.js'),
//     loading: MyLoadingComponent,
//     delay: 1
// });





//创建store对象
let store = createStore(reducer, applyMiddleware(reduxLogger, reduxThunk))

//对<APP/>组件进行改装
ReactDOM.render(
    <Provider store={store}>
        <Router>
                <App />
        </Router>
    </Provider>
    , document.getElementById('root'));
serviceWorker.unregister();
