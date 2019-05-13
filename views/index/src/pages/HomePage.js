import React, { Component } from 'react';

//组件的引入
//移动导航栏和电脑导航栏
import DesktopContainer from '../component/DesktopContainer.js'
import MobileContainer from '../component/MobileContainer.js'
import Bottom from '../component/Bottom.js'
import HomeCenter from '../component/HomeCenter.js'

//semantic的组件的引入
import PropTypes from 'prop-types'

//判断响应电脑版和移动版
const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)
ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}


//主页
class HomePage extends Component {
  render() {
    return (
      <div>
        <ResponsiveContainer />
        <HomeCenter />
        <Bottom />
      </div>
    )
  }
}

export default HomePage