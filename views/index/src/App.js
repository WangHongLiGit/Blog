import React, { Component } from 'react';
import './App.css';

//react路由的引入
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

//semantic中css的引入
import 'semantic-ui-css/semantic.min.css';


//组件的引入
//移动导航栏和电脑导航栏
import DesktopContainer from './component/DesktopContainer.js'
import MobileContainer from './component/MobileContainer.js'
import HomeCenter from './routers/HomeCenter.js'
import ItemCenter from './routers/ItemCenter.js'
import AllBlogCenter from './routers/AllBlogCenter.js'
import Login from './routers/Login.js'
import Register from './routers/Register.js'
import BlogTalk from './routers/BlogTalk.js'
import BlogReply from './routers/BlogReply.js'





//semantic的组件的引入
import PropTypes from 'prop-types'

//判断响应电脑版网页还是移动版网页
const HomeResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)
HomeResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

function App() {
  return (
    <div>
      <HomeResponsiveContainer>
        <Route exact path="/" component={HomeCenter}></Route>
        <Route path="/ItemCenter" component={ItemCenter}></Route>
        <Route path="/BlogTalk" component={BlogTalk}></Route>
        <Route path="/BlogReply" component={BlogReply}></Route>
        <Route path="/Login" component={Login}></Route>
        <Route path="/Register" component={Register}></Route>
        <Route path="/AllBlogCenter" component={AllBlogCenter}></Route>
      </HomeResponsiveContainer>
    </div>
  );
}

export default App;
