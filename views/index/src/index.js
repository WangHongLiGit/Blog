import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//redux引入
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';

//路由
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


//reducer文件引入
import reducer from './reducers'


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
