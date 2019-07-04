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
  Image
} from 'semantic-ui-react'
import HomepageHeading from './HomepageHeading.js'
import Bottom from './Bottom.js'
import MessageShow from "../component/MessageShow.js"

import { connect } from 'react-redux';
import { handle_change_route, handle_change_up } from "../actions"


import logo from "../img/logo.jpg"


import { Link } from 'react-router-dom';


const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

//导航栏（移动版）
class MobileContainer extends Component {
  state = {
    activeItem: "",
    fixed: false
  }

  //点击首页链接和点击普通链接
  handleItemClick(name) {
    this.setState({ activeItem: name, sidebarOpened: false })
    this.props.handleChangeUp(true)
    this.returnUp()
  }
  handleClearItemClick(name, accoutInput, passwordInput, nicknameInput, danger) {
    this.setState({ activeItem: name, IsSlideUp: true, sidebarOpened: false })
    this.props.handleChangeUp(true)
    this.props.handleChangeRoute(accoutInput, passwordInput, nicknameInput, danger)
    this.returnUp()
  }
  handleHomeClick(name) {
    this.setState({ activeItem: name, IsSlideUp: false, sidebarOpened: false });
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

  //滑动条
  handleSidebarHide = () => this.setState({ sidebarOpened: false })
  handleToggle = () => {
    this.setState({ sidebarOpened: true })
  }

  //监听是否超过这个Visibility 来固定圆圈导航栏
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })


  //相当重要了这个  因为这个是学会了运用基本的js中的wiindow中的location属性获取了一系列参数
  componentWillMount() {
    this.setState(
      {
        activeItem: window.location.pathname
      }
    )
    this.props.handleChangeUp(!(window.location.pathname == "/"))
  }

  render() {
    const { IsSlideUp, children, nicknameInput, accoutInput, passwordInput, danger } = this.props;

    const { sidebarOpened, activeItem, fixed } = this.state
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
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button circular icon='home' size="large" onClick={() => { this.handleHomeClick("1") }} />
              </Link>
              <Button circular icon='angle up' size="large" onClick={() => { this.returnUp() }} />
            </div>
          </Transition>
        </div>

        {/*包括呼出的*/}
        <Sidebar
          as={Menu}
          animation='push'
          style={{ maxHeight: "1000px", position: "fixed", top: "0px", textAlign: "center",background:"#464849"}}
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
            <Menu.Item as='a' name='/' active={activeItem === '/'} onClick={() => { this.handleHomeClick("/") }}
            >首页
            </Menu.Item>
          </Link>
          <Link to="/AllBlogCenter" >
            <Menu.Item as='a' name='/AllBlogCenter' active={activeItem === '/AllBlogCenter'} onClick={() => { this.handleItemClick("/AllBlogCenter") }}>
              所有博文
            </Menu.Item>
          </Link>
          <Link to="/TalkCenter">
            <Menu.Item as='a' name='/TalkCenter' active={activeItem === '/TalkCenter'} onClick={() => { this.handleItemClick("/TalkCenter") }}>
              Blog留言
            </Menu.Item>
          </Link>
          <Link to="/userCenter">
            <Menu.Item as='a' name='/userCenter' active={activeItem === '/userCenter'} onClick={() => { this.handleItemClick("/userCenter") }}>
              个人信息
            </Menu.Item>
          </Link>
          <Link to="/Login">
            <Menu.Item as='a' name='/Login' active={activeItem === '/Login'} onClick={() => { this.handleClearItemClick("/Login", accoutInput, passwordInput, nicknameInput, danger) }}>
              登录
            </Menu.Item>
          </Link>
          <Link to="/Register">
            <Menu.Item as='a' name='/Register' active={activeItem === '/Register'} onClick={() => { this.handleClearItemClick("/Register", accoutInput, passwordInput, nicknameInput, danger) }}>
              注册
            </Menu.Item>
          </Link>
        </Sidebar>

        {/*pusher里面包括整个的网页内容*/}
        <Sidebar.Pusher dimmed={sidebarOpened}
        >
          <div 
          tabIndex="-1"
          ref={node => { this.fileInput = node }}
          onFocus={()=>{
            this.fileInput.className="clearBorder"
          }}
          >
            <Visibility
              once={false}
              onBottomPassed={this.showFixedMenu}
              onBottomPassedReverse={this.hideFixedMenu}
            >
              <Segment
                inverted
                textAlign='center'
                style={IsSlideUp ? { height: "53px", padding: '0.1em 0em', transition: "all .7s ease",background:"#74787a"} : { height: "247px", padding: '0.1em 0em', transition: "all .7s ease",background:"#74787a"}}                vertical
              >
                <Container style={{ transform: "none", height: "40px" }}>
                  <Menu
                    inverted
                    pointing
                    style={{ borderWidth: "0px", height: "50px" }}
                    secondary
                    size='large'>
                    <Menu.Item onClick={this.handleToggle} float="left" style={{ lineHeight: "9px" }}>
                      <Icon name='bars' />
                    </Menu.Item>

                    <Menu.Item position='right'
                      style={{ height: "50px" }}
                    >
                      <Link to="/Login">
                        <Button as='a' size="tiny" inverted onClick={() => { this.handleClearItemClick("/Login", accoutInput, passwordInput, nicknameInput, danger) }}>
                          登录
                    </Button>
                      </Link>
                      <Link to="/Register">
                        <Button as='a' size="tiny" inverted style={{ marginLeft: '0.5em' }} onClick={() => { this.handleClearItemClick("/Register", accoutInput, passwordInput, nicknameInput, danger) }}>
                          注册
                    </Button>
                      </Link>
                    </Menu.Item>
                  </Menu>
                </Container>
                <MessageShow></MessageShow>
                <HomepageHeading mobile={true} IsSlideUp={IsSlideUp} />
              </Segment>
            </Visibility>

            {children}
          </div>
          <Bottom />
        </Sidebar.Pusher>
      </Responsive >

    )
  }
}

MobileContainer.propTypes = {
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
)(MobileContainer)
