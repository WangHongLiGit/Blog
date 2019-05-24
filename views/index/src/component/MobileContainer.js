import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Transition,
  Divider,
  Header,
  Image
} from 'semantic-ui-react'
import HomepageHeading from './HomepageHeading.js'
import Bottom from './Bottom.js'

import { connect } from 'react-redux';
import { handle_account_input, handle_password_input, handle_login_click,handle_change_route} from "../actions"


import logo from "../img/logo.jpg"


import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

//导航栏（移动版）
class MobileContainer extends Component {
  state = {
    activeItem: '1',
    IsMobilSlideUp: false,
    fixed: false
  }

  //点击首页链接和点击普通链接
  handleItemClick(name) {
    this.setState({ activeItem: name, IsMobilSlideUp: true, sidebarOpened: false })
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    })
  }
  handleClearItemClick(name,accoutInput, passwordInput, nicknameInput,danger) {
    this.setState({ activeItem: name, IsMobilSlideUp: true, sidebarOpened: false })
    this.props.handleChangeRoute(accoutInput, passwordInput, nicknameInput,danger)
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    })
  }
  handleHomeClick(name) {
    this.setState({ activeItem: name, IsMobilSlideUp: false, sidebarOpened: false });
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    })
  }


  //回到顶部
  returnUp() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    })
  }

  //滑动条
  handleSidebarHide = () => this.setState({ sidebarOpened: false })
  handleToggle = () => this.setState({ sidebarOpened: true })

  //监听是否超过这个Visibility 来固定圆圈导航栏
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })


  //相当重要了这个  因为这个是学会了运用基本的js中的wiindow中的location属性获取了一系列参数
  componentWillMount() {
    this.setState({ IsMobilSlideUp: !(window.location.pathname == "/HomeCenter" || window.location.pathname == "/") })
  }

  render() {
    const {children,nicknameInput,accoutInput, passwordInput, danger, handleAccountInput,handlePasswordInput,handleLoginClick,handleChangeRoute} = this.props;

    const { sidebarOpened, activeItem, IsMobilSlideUp, fixed, visible } = this.state
    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        style={{ transform: "none" }}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >

        {/* 固定的圆圈导航栏 */}
        <div style={{ position: "fixed", top: "0px", right: "0px", zIndex: "100", width: "100%", textAlign: "center", color: '#fff' }}>
          <Transition visible={fixed} animation='scale' duration={300} >
            <div>
              <Button circular icon='bars' size="large" onClick={() => { this.handleToggle() }} />
              <Link to="/" style={{textDecoration:"none"}}>
                <Button circular icon='home' size="large"  onClick={() => { this.handleHomeClick("1") }}/>
              </Link>
              <Button circular icon='angle up' size="large" onClick={() => { this.returnUp() }} />
            </div>

          </Transition>
        </div>

        {/*包括呼出的*/}
        <Sidebar
          as={Menu}
          animation='push'
          style={{ maxHeight: "1000px", position: "fixed", top: "0px", textAlign: "center"}}
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item >
            <Image src={logo} size="tiny" circular style={{ margin: "0px auto" }} />
            <p style={{ fontSize: "20px" }}>HongLi</p>
          </Menu.Item>
          <Link to="/">
            <Menu.Item as='a' name='1' active={activeItem === '1'} onClick={() => { this.handleHomeClick("1") }}
            >首页
            </Menu.Item>
          </Link>
          <Link to="/AllBlogCenter" >
            <Menu.Item as='a' name='2' active={activeItem === '2'} onClick={() => { this.handleItemClick("2") }}>
              所有博文
            </Menu.Item>
          </Link>
          <Link to="/TalkCenter">
            <Menu.Item as='a' name='3' active={activeItem === '3'} onClick={() => { this.handleItemClick("3") }}>
              Blog留言
            </Menu.Item>
          </Link>
          <Link to="/AboutAuthor">
            <Menu.Item as='a' name='4' active={activeItem === '4'} onClick={() => { this.handleItemClick("4") }}>
              关于作者
            </Menu.Item>
          </Link>
          <Link to="/Login">
            <Menu.Item as='a' name='5' active={activeItem === '5'} onClick={() => { this.handleClearItemClick("5",accoutInput, passwordInput, nicknameInput,danger) }}>
              登录
            </Menu.Item>
          </Link>
          <Link to="/Register">
            <Menu.Item as='a' name='6' active={activeItem === '6'} onClick={() => { this.handleClearItemClick("6",accoutInput, passwordInput, nicknameInput,danger) }}>
              注册
            </Menu.Item>
          </Link>

        </Sidebar>

        {/*pusher里面包括整个的网页内容*/}
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
          >
            <Segment
              inverted
              textAlign='center'
              style={IsMobilSlideUp ? { height: "64px", padding: '0.1em 0em', transition: "all .7s ease"} : { height: "305px", padding: '0.1em 0em', transition: "all .7s ease"}}
              vertical
            >
              <Container style={{ transform: "none" }}>
                <Menu
                  inverted
                  pointing
                  style={{borderWidth: "0px",}}
                  secondary
                  size='large'>
                  <Menu.Item onClick={this.handleToggle} float="left" style={{ marginBottom: " 9px" }}>
                    <Icon name='bars' />
                  </Menu.Item>

                  <Menu.Item position='right'>
                    <Link to="/Login">
                      <Button as='a' inverted onClick={() => {this.handleClearItemClick("5",accoutInput, passwordInput, nicknameInput,danger) }}>
                        登录
                    </Button>
                    </Link>
                    <Link to="/Register">
                      <Button as='a' inverted style={{ marginLeft: '0.5em' }} onClick={() => {this.handleClearItemClick("5",accoutInput, passwordInput, nicknameInput,danger)  }}>
                        注册
                    </Button>
                    </Link>
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile={true} IsSlideUp={IsMobilSlideUp} />
            </Segment>
          </Visibility>
          {children}
          <Bottom />
        </Sidebar.Pusher>
      </Responsive>

    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}


export default connect(
  state => {
      return {
          nicknameInput:state.nicknameInput,
          accoutInput: state.accoutInput,
          passwordInput: state.passwordInput,
          danger: state.danger,
      }
  },
  dispatch => ({
      handleAccountInput: function (value, danger, accoutInput) {
          dispatch(handle_account_input(value, danger, accoutInput))
      },
      handlePasswordInput: function (value, danger, passwordInput) {
          dispatch(handle_password_input(value, danger, passwordInput))
      },
      handleLoginClick: function (accoutInput,passwordInput, danger) {
          dispatch(handle_login_click(accoutInput,passwordInput, danger))
      },
      handleChangeRoute: function (accoutInput, passwordInput, nicknameInput,danger) {
          dispatch(handle_change_route(accoutInput, passwordInput, nicknameInput,danger))
      }
  })
)(MobileContainer)
