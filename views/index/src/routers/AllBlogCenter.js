import React, { Component } from 'react';
import {
    Grid,
    Header,
    Icon,
    Image,
    Card,
    List,
    Menu,
} from 'semantic-ui-react'
import $ from "jquery";
import SearchPart from "../component/SearchPart"

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { handle_push_history, handle_change_up } from "../actions"
import ConnectMe from "../component/ConnectMe"
import updating from "../img/updating.jpg"

var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return '' + path
}



//3.右侧广告位
const ContactAndAdvertisment = () => (
    <Card fluid>
        <Card.Content>
            <Card.Header>广告位</Card.Header>
        </Card.Content>
        <Card.Content >
            <Image
                src='https://react.semantic-ui.com/images/wireframe/image-text.png'
                as='a'
                size='medium'
                href='http://google.com'
                target='_blank'
            />
        </Card.Content>
    </Card>
)


class AllBlogCenter extends Component {
    state = {
        activeItem: 'blogBuild',
        allBlog: [],
        loading: false,
    }
    changeCategery(categery) {
        this.setState({ activeItem: categery })
        $.ajax({
            type: "get",
            url: baseUrl.get(`/allBlogCenter/${categery}`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            beforeSend: () => {
                this.setState({ loading: true })
            },
            success: (data) => {
                this.setState({ allBlog: data })
                window.setTimeout(() => {
                    this.setState(
                        {
                            loading: false
                        }
                    )
                }
                    , 600)
            },
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
    componentWillMount() {
        this.props.handlePushHistory(this.props.historyArr, "/AllBlogCenter")
        $.ajax({
            type: "get",
            url: baseUrl.get(`/allBlogCenter/blogBuild`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            beforeSend: () => {
                this.setState({ loading: true })
            },
            success: (data) => {
                this.setState({ allBlog: data })
                window.setTimeout(() => {
                    this.setState(
                        {
                            loading: false
                        }
                    )
                }
                    , 600)
            },
        })
    }
    render() {
        let { allBlog, loading, activeItem } = this.state;
        return (
            <Grid container style={{ margin: "32px", minHeight: "800px" }}>
                {/* 左侧数据 12格*/}


                <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}
                >

                    <Grid columns={16} style={{ padding: "0px" }}>

                        {/* 标头  15格 */}
                        <Grid.Column mobile={16} tablet={16} computer={15} style={{ padding: "0px" }}>
                            <div style={{ display: "inline-block", width: "40%" }}>
                                <Header as='h3' color='black' style={{ fontSize: "1.2rem", fontWeight: "700", paddingLeft: "`1rem" }}>
                                    <Icon name='hotjar' />
                                    <Header.Content>热门博文</Header.Content>
                                </Header>
                            </div>
                            <div style={{ display: "inline-block", width: "60%", margin: "-8px 0px" }}>
                                <SearchPart historyByProps={this.props.history}></SearchPart>
                            </div>
                        </Grid.Column>

                        {/* 博客分类 */}
                        <Grid.Column mobile={16} tablet={16} computer={15} style={{ marginTop: "12px" }}>
                            <Grid>
                                <Grid.Column mobile={16} tablet={16} computer={8} style={{ padding: "5px 14px", height: "50px" }}>
                                    <Menu
                                        size='small'
                                        pointing
                                        style={{}}
                                    >
                                        <Menu.Item name='blogBuild' active={activeItem === 'blogBuild'} style={{ width: "60%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('blogBuild') }}>
                                            node博客实战
                                                </Menu.Item>
                                        <Menu.Item name='Question' active={activeItem === 'Question'} style={{ width: "40%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('Question') }}>
                                            遇到的坑
                                    </Menu.Item>
                                    </Menu>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={8} style={{ padding: "5px 14px", height: "50px" }}>
                                    <Menu
                                        size='small'
                                        pointing
                                    >
                                        <Menu.Item name='react' active={activeItem === 'react'} style={{ width: "33.3%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('react') }}>
                                            react
                                                </Menu.Item>
                                        <Menu.Item name='node' active={activeItem === 'node'} style={{ width: "33.3%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('node') }}>
                                            node
                                            </Menu.Item>
                                        <Menu.Item name='ES6' active={activeItem === 'ES6'} style={{ width: "33.3%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('ES6') }}>
                                            ES6
                                            </Menu.Item>
                                    </Menu>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={8} style={{ padding: "5px 14px", height: "50px" }}>
                                    <Menu
                                        size='small'
                                        pointing
                                    >
                                        <Menu.Item name='react-redux' active={activeItem === 'react-redux'} style={{ width: "50%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('react-redux') }}>
                                            react-redux
                                                </Menu.Item>
                                        <Menu.Item name='react-router' active={activeItem === 'react-router'} style={{ width: "50%", textAlign: "center", display: "inline-block" }} onClick={() => { this.changeCategery('react-router') }}>
                                            react-router
                                            </Menu.Item>
                                    </Menu>
                                </Grid.Column>
                            </Grid>


                        </Grid.Column>
                        {
                            loading ?
                                <div className="loaderDiv" >
                                    <div className="loader" style={{ top: "26%" }}>
                                        <span className="text">Loading</span>
                                        <span className="spinner"></span>
                                    </div>
                                </div>
                                :
                                <Grid.Column mobile={16} tablet={16} computer={16}>
                                    <Grid>
                                        {allBlog.map((v, k) => (
                                            <Grid.Column mobile={16} tablet={5} computer={5} key={k}
                                            >
                                                <Link to={{ pathname: `/BlogItems/${v.direcionName}/${v.direcionNum}` }} onClick={() => { this.returnUp() }}>
                                                    <Card fluid link style={{ height: "100%" }}>
                                                        <Image src={v.blogLogoPath} style={{ height: "150px" }} />
                                                        <Card.Content>
                                                            <Card.Header style={{ fontSize: "1.5rem" }}>{v.title}</Card.Header>
                                                            <Card.Description style={{ fontSize: "0.9rem" }}>
                                                                {v.readme}
                                                            </Card.Description>
                                                        </Card.Content>
                                                        <Card.Content extra style={{ padding: "3px" }}>
                                                            <List style={{ width: "100%", display: "flex", justifyContent: "center", fontSize: "0.9rem" }} horizontal>
                                                                <List.Item style={{ width: "33%", textAlign: "center" }}>
                                                                    <Icon name='user' style={{ marginRight: "4px" }} />
                                                                    HongLi
                                                </List.Item>
                                                                <List.Item style={{ width: "33%", textAlign: "center" }}>
                                                                    <Icon name='eye' style={{ marginRight: "4px" }} />
                                                                    {v.viewNUm}
                                                                </List.Item>
                                                                <List.Item style={{ width: "33%", textAlign: "center" }}>
                                                                    <Icon name='comment alternate' style={{ marginRight: "4px" }} />
                                                                    {v.commentNum}
                                                                </List.Item>
                                                            </List>
                                                        </Card.Content>
                                                    </Card>
                                                </Link>
                                            </Grid.Column>
                                        ))
                                        }
                                        <Grid.Column mobile={16} tablet={5} computer={5}
                                        >
                                            <Card fluid link style={{ height: "100%" }}>
                                                <Image src={updating} style={{ height: "150px" }} />
                                                <Card.Content>
                                                    <Card.Header style={{ fontSize: "1.5rem" }}>作者正在努力更新中</Card.Header>
                                                    <Card.Header style={{ fontSize: "1.5rem" }}>最近课贼多。。。</Card.Header>

                                                    <Card.Description style={{ fontSize: "0.9rem" }}>
                                                        <b>作者目前还是一个学生，平时课程还贼多~，更新速度慢。。。请见谅~~</b>
                                                        <Card.Description style={{ fontSize: "0.9rem" }}>
                                                            <b>如果任何问题，请加博主微信或者QQ联系
                                                                感谢您的支持~~</b>
                                                        </Card.Description>

                                                    </Card.Description>
                                                </Card.Content>
                                                <Card.Content extra style={{ padding: "3px" }}>
                                                    <List style={{ width: "100%", display: "flex", justifyContent: "center", fontSize: "0.9rem" }} horizontal>
                                                        <List.Item style={{ width: "33%", textAlign: "center" }}>
                                                            <Icon name='user' style={{ marginRight: "4px" }} />
                                                            HongLi
                                                </List.Item>
                                                        <List.Item style={{ width: "33%", textAlign: "center" }}>
                                                            <Icon name='eye' style={{ marginRight: "4px" }} />
                                                            >10K
                                                                </List.Item>
                                                        <List.Item style={{ width: "33%", textAlign: "center" }}>
                                                            <Icon name='comment alternate' style={{ marginRight: "4px" }} />
                                                            >10K
                                                                </List.Item>
                                                    </List>
                                                </Card.Content>
                                            </Card>
                                        </Grid.Column>
                                    </Grid>
                                </Grid.Column>
                        }


                    </Grid>
                </Grid.Column>

                {/* 每篇博文  5格*/}



                {/*右侧*/}
                <Grid.Column mobile={16} tablet={4} computer={4}>
                    <ContactAndAdvertisment></ContactAndAdvertisment>
                    <ContactAndAdvertisment></ContactAndAdvertisment>
                    <ConnectMe></ConnectMe>
                </Grid.Column>

            </Grid>
        )
    }
}



//
export default connect(
    state => {
        return {
            IsSlideUp: state.IsSlideUp,
            historyArr: state.historyArr
        }
    },
    dispatch => ({
        handleChangeUp: function (IsSlideUp) {
            dispatch(handle_change_up(IsSlideUp))
        },
        handlePushHistory: function (historyArr, newRoute) {
            dispatch(handle_push_history(historyArr, newRoute))
        },
    })
)(AllBlogCenter)