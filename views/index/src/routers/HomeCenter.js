import React, { Component } from 'react';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    List,
} from 'semantic-ui-react'
import $ from "jquery";
import SearchPart from "../component/SearchPart"
//测试图片的引入
import {Link} from 'react-router-dom';
import {handle_change_up, handle_push_history } from "../actions"
import { connect } from 'react-redux';
import ConnectMe from "../component/ConnectMe"

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


class HomeCenter extends Component {
    state = {
        hotBlog: [],
        loading: false,
    }
    ChangeUp(IsSlideUp) {
        this.props.handleChangeUp(IsSlideUp)
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        })
    }
    componentWillMount() {
        this.props.handlePushHistory(this.props.historyArr, "/")
        $.ajax({
            type: "get",
            url: baseUrl.get(`/hotBlogCenter`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            beforeSend: () => {
                this.setState({ loading: true })
            },
            success: (data) => {
                this.setState({ hotBlog: data })
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
        let { hotBlog, loading } = this.state;

        return (
            <Grid container style={{ marginTop: "32px",minHeight:"900px",marginBottom: "12px"}}>
                {/* 左侧数据 12格*/}
                {
                    loading ?
                        <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}>
                            <div className="loaderDiv" >
                                <div className="loader" style={{ top: "20%" }}>
                                    <span className="text">Loading</span>
                                    <span className="spinner"></span>
                                </div>
                            </div>
                        </Grid.Column>
                        :
                        <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}>
                            <Grid columns={16} style={{ padding: "0px" }}>

                                {/* 标头  15格 */}
                                <Grid.Column mobile={16} tablet={16} computer={15} style={{ padding: "0px"}}>
                                    <div style={{ display: "inline-block", width: "40%" }}>
                                        <Header as='h3' color='black' style={{ fontSize: "1.2rem",fontWeight: "700",paddingLeft: "`1rem"}}>
                                            <Icon name='hotjar' />
                                            <Header.Content>热门博文</Header.Content>
                                        </Header>
                                    </div>
                                    <div style={{ display: "inline-block", width: "60%",margin:"-8px 0px"}}>
                                        <SearchPart historyByProps={this.props.history}></SearchPart>
                                    </div>
                                    <Divider style={{ marginBottom: "0px" }} />
                                </Grid.Column>


                                {/* 每篇博文  5格*/}
                                {hotBlog.map((v, k) => (
                                    <Grid.Column mobile={16} tablet={5} computer={5} key={k}
                                    >
                                        <Link to={{ pathname: `/BlogItems/${v.direcionName}/${v.direcionNum}` }} onClick={() => { this.ChangeUp(true) }}>
                                            <Card fluid link  style={{ height: "100%" }}>
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

                            </Grid>
                        </Grid.Column>
                }


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

export default connect(
    state => {
        return {
            historyArr: state.historyArr,
        }
    },
    dispatch => ({
        handleChangeUp: function (IsSlideUp) {
            dispatch(handle_change_up(IsSlideUp))
        },
        handlePushHistory: function (historyArr, newRoute) {
            dispatch(handle_push_history(historyArr, newRoute))
        }
    })
)(HomeCenter)
