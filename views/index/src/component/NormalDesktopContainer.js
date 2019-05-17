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


//电脑版导航栏
const getWidth = () => {
    const isSSR = typeof window === 'undefined'
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
  }
  
class NormalDesktopContainer extends Component {
    state = {}
  
    hideFixedMenu = () => this.setState({ fixed: false })
    showFixedMenu = () => this.setState({ fixed: true })
  
    render() {
      const { children } = this.props
      const { fixed } = this.state
  
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
              textAlign='center'
            >
              <Menu
                fixed={fixed ? 'top' : null}
                inverted={!fixed}
                pointing={!fixed}
                secondary={!fixed}
                size='large'
              >
                <Container>
                  <Menu.Item as='a' active>
                    主页
                  </Menu.Item>
                  <Menu.Item as='a'>全部博文</Menu.Item>
                  <Menu.Item as='a'>随笔</Menu.Item>
                  <Menu.Item as='a'>关于作者</Menu.Item>
                  <Menu.Item position='right'>
                    <Button as='a' inverted={!fixed}>
                      登录
                    </Button>
                    <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                      注册
                    </Button>
                  </Menu.Item>
                </Container>
              </Menu>
            </Segment>
          </Visibility>
          {children}
        </Responsive>
      )
    }
  }
  NormalDesktopContainer.propTypes = {
    children: PropTypes.node,
  }


export default NormalDesktopContainer