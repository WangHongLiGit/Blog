import React, { Component } from 'react';
import './App.css';

//react路由的引入
import { Route } from 'react-router-dom';
//semantic中css的引入
import 'semantic-ui-css/semantic.min.css';


//组件的引入
//移动导航栏和电脑导航栏
import DesktopContainer from './component/DesktopContainer.js'
import MobileContainer from './component/MobileContainer.js'
import userCenter from './routers/userCenter.js'



import Login from './routers/Login.js'
import Register from './routers/Register.js'

//semantic的组件的引入

import Loadable from 'react-loadable';



function NormalLoading({ error, pastDelay }) {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    return (
      <div style={{height:"1000px"}}></div>
    )
  } else {
    return null;
  }
}


//只需给有多个ajax操作，并且页面数据庞大的路由的封装  
const HomeCenter = Loadable({
  loader: () => import('./routers/HomeCenter.js'),
  loading: NormalLoading,
  delay: 300
});

const BlogItems = Loadable({
  loader: () => import('./routers/BlogItems.js'),
  loading: NormalLoading,
  delay: 300
});
const AllBlogCenter = Loadable({
  loader: () => import('./routers/AllBlogCenter.js'),
  loading: NormalLoading,
  delay: 300
});
const TalkCenter = Loadable({
  loader: () => import('./routers/TalkCenter.js'),
  loading: NormalLoading,
  delay: 300
});




//判断响应电脑版网页还是移动版网页
class HomeResponsiveContainer extends Component{
  render(){
    const {children}=this.props;
    return(
<div>
    <DesktopContainer >{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
    )
  }

}

function App() {
  return (
    <div>
      <HomeResponsiveContainer>
        <Route exact path="/" component={HomeCenter}></Route>
        <Route path="/AllBlogCenter" component={AllBlogCenter}></Route>
        <Route path="/BlogItems" component={BlogItems}></Route>
        <Route path="/TalkCenter" component={TalkCenter}></Route>
        <Route path="/Login" component={Login}></Route>
        <Route path="/Register" component={Register}></Route>
        <Route path="/userCenter" component={userCenter}></Route>
      </HomeResponsiveContainer>
    </div>
  );
}

export default App;
