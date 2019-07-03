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
import MessageShow from "../component/MessageShow.js"
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { handle_change_route, handle_change_up } from "../actions"



import Bottom from './Bottom.js'




//电脑版导航栏
const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopContainer extends Component {
  state = {
    activeItem: '',
  }
  handleItemClick(name) {
    this.setState({ activeItem: name })
    this.props.handleChangeUp(true)
    this.returnUp()
  }
  handleClearItemClick(name, accoutInput, passwordInput, nicknameInput, danger) {
    this.setState({ activeItem: name, IsSlideUp: true })
    this.props.handleChangeUp(true)
    this.props.handleChangeRoute(accoutInput, passwordInput, nicknameInput, danger)
    this.returnUp()
  }
  handleHomeClick(name) {
    this.setState({ activeItem: name });
    this.props.handleChangeUp(false)
    this.returnUp()
  }



  //回到顶部
  returnUp() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    })
  }
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })
  //相当重要了这个  因为这个是学会了运用基本的js中的wiindow中的location属性获取了一系列参数
  //自从换成hashRouter之后  我们的pathname就始终变成了"/"  componentWillMount() {
  componentWillMount() {
    this.setState(
      {
        activeItem: window.location.hash.substring(1)
      }
    )
    this.props.handleChangeUp(!(window.location.hash === "#/"))
  }

  render() {
    const { IsSlideUp, children, nicknameInput, accoutInput, passwordInput, danger} = this.props;
    const { fixed, activeItem } = this.state
console.log("桌面端的",Responsive.onlyTablet.minWidth)
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
                  <Menu.Item name='/' active={activeItem === '/'} onClick={() => { this.handleHomeClick("/") }}>
                    首页
                </Menu.Item>
                </Link>
                <Link to="/AllBlogCenter">
                  <Menu.Item name='/AllBlogCenter' active={activeItem === '/AllBlogCenter'} onClick={() => { this.handleItemClick("/AllBlogCenter") }}>
                    全部博文
                </Menu.Item>
                </Link>
                <Link to="/TalkCenter">
                  <Menu.Item name='/TalkCenter' active={activeItem === '/TalkCenter'} onClick={() => { this.handleItemClick("/TalkCenter") }}>
                    Blog留言
                </Menu.Item>
                </Link>
                <Link to="/userCenter">
                  <Menu.Item name='/userCenter' active={activeItem === '/userCenter'} onClick={() => { this.handleItemClick("/userCenter") }}>
                    个人信息
                </Menu.Item>
                </Link>

                <Menu.Item position='right' style={{ marginTop: "-7px" }}>
                  <Link to="/Login">
                    <Button as='a' inverted={!fixed} onClick={() => { this.handleClearItemClick("5", accoutInput, passwordInput, nicknameInput, danger) }}>
                      登录
                    </Button>
                  </Link>
                  <Link to="/Register">
                    <Button as='a' inverted={!fixed} primary={fixed} onClick={() => { this.handleClearItemClick("6", accoutInput, passwordInput, nicknameInput, danger) }}>
                      注册
                    </Button>
                  </Link>

                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading IsSlideUp={IsSlideUp} />
            <MessageShow></MessageShow>
          </Segment>
        </Visibility>

        {children}
        <Bottom  backColor="#1b1c1d"/>
      </Responsive>
    )
  }
}
DesktopContainer.propTypes = {
  children: PropTypes.node,
}

export default connect(
  state => {
    return {
      nicknameInput: state.nicknameInput,
      accoutInput: state.accoutInput,
      passwordInput: state.passwordInput,
      danger: state.danger,
      IsSlideUp: state.IsSlideUp,
    }
  },
  dispatch => ({
    handleChangeUp: function (IsSlideUp) {
      dispatch(handle_change_up(IsSlideUp))
    },
    handleChangeRoute: function (accoutInput, passwordInput, nicknameInput, danger) {
      dispatch(handle_change_route(accoutInput, passwordInput, nicknameInput, danger))
    }
  })
)(DesktopContainer)
