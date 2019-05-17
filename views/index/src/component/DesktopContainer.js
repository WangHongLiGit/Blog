import React, { Component } from 'react';
import {
  Button,
  Container,
  Menu,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react'

import PropTypes from 'prop-types'
import HomepageHeading from './HomepageHeading.js'

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


import Bottom from './Bottom.js'

//history
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();


//电脑版导航栏
const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopContainer extends Component {
  state = {
    activeItem: '1',
    IsSlideUp: false
  }
  handleItemClick(name) {
    this.setState({ activeItem: name, IsSlideUp: true })
  }
  handleHomeClick(name) {
    this.setState({ activeItem: name, IsSlideUp: false });
  }
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })
  //相当重要了这个  因为这个是学会了运用基本的js中的wiindow中的location属性获取了一系列参数
  componentWillMount() {
    this.setState({ IsSlideUp: !(window.location.pathname == "/HomeCenter" || window.location.pathname == "/") })
  }

  render() {
    const { children, history } = this.props
    const { fixed, IsSlideUp, activeItem } = this.state

    return (
      //在桌面宽度下可见  小于最小桌面宽度不可见
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        {/* 控制单个导航栏的的固定  监听onBottomPassed和onBottomPassedReverse改变导航固定状态*/}
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={IsSlideUp ? { height: "78px", padding: '1em 0em', transition: "all .6s ease" } : { height: "700px", padding: '1em 0em', transition: "all .6s ease" }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Link to="/">
                  <Menu.Item name='1' active={activeItem === '1'} onClick={() => { this.handleHomeClick("1") }}>
                    首页
                </Menu.Item>
                </Link>
                <Link to="/AllBlogCenter">
                  <Menu.Item name='2' active={activeItem === '2'} onClick={() => { this.handleItemClick("2") }}>
                    全部博文
                </Menu.Item>
                </Link>
                <Link to="/BlogTalk">
                  <Menu.Item name='3' active={activeItem === '3'} onClick={() => { this.handleItemClick("3") }}>
                  Blog留言
                </Menu.Item>
                </Link>
                <Link to="/ItemCenter">
                  <Menu.Item name='4' active={activeItem === '4'} onClick={() => { this.handleItemClick("4") }}>
                    关于作者
                </Menu.Item>
                </Link>

                <Menu.Item position='right' style={{marginTop: "-7px"}}>
                  <Link to="/Login">
                    <Button as='a' inverted={!fixed} onClick={() => { this.handleItemClick("4") }}>
                      登录
                    </Button>
                  </Link>
                  <Link to="/Register">
                    <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} onClick={() => { this.handleItemClick("4") }}>
                      注册
                    </Button>
                  </Link>

                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading IsSlideUp={IsSlideUp} />
          </Segment>
        </Visibility>

        {children}
        <Bottom />
      </Responsive>
    )
  }
}
DesktopContainer.propTypes = {
  children: PropTypes.node,
}


export default DesktopContainer