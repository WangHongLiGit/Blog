import React, { Component } from 'react';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    Feed,
    List,
    Transition
} from 'semantic-ui-react'
import $ from "jquery";

//测试图片的引入
import imgPath from '../img/dns.png'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return 'http://127.0.0.1:4000' + path
}


//2.右侧最近更新
const CardExampleContentBlock = () => (
    <Card fluid>
        <Card.Content>
            <Card.Header>最近更新</Card.Header>
        </Card.Content>
        <Card.Content>
            <Feed>
                <Feed.Event>
                    <Feed.Content>
                        <Feed.Date content='1 day ago' />
                        <Feed.Summary>
                            You added <a>Jenny Hess</a> to your <a>coworker</a> group.
              </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                    <Feed.Content>
                        <Feed.Date content='3 days ago' />
                        <Feed.Summary>
                            You added <a>Molly Malone</a> as a friend.
              </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                    <Feed.Content>
                        <Feed.Date content='4 days ago' />
                        <Feed.Summary>
                            You added <a>Elliot Baker</a> to your <a>musicians</a> group.
              </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        </Card.Content>
    </Card>
)

//3.右侧广告位
const ContactAndAdvertisment = () => (
    <Card fluid>
        <Card.Content>
            <Card.Header>所有博文</Card.Header>
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
        allBlog: [],
        loading: false,
    }
    componentWillMount() {
        $.ajax({
            type: "get",
            url: baseUrl.get(`/allBlogCenter`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            beforeSend: () => {
                this.setState({ loading: true })
            },
            success: (data) => {
                this.setState({ allBlog: data, loading: false })
            },
        })
    }
    render() {
        let { allBlog, loading } = this.state;
        console.log("从事", allBlog)
        return (
            <Grid container style={{ margin: "32px" }}>
                {
                    loading ?
                        <div className="loaderDiv" >
                            <div className="loader" style={{ top: "20%" }}>
                                <span className="text">Loading</span>
                                <span className="spinner"></span>
                            </div>
                        </div>
                        :
                        <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}>
                            <Grid columns={16} style={{ padding: "0px" }}>
                                <Grid.Column mobile={16} tablet={16} computer={15} style={{ padding: "0px" }}>
                                    <Header as='h3'>
                                        <Icon name='hotjar' />
                                        <Header.Content>热门博文</Header.Content>
                                    </Header>
                                    <Divider style={{ marginBottom: "0px" }} />
                                </Grid.Column>



                                {allBlog.map((v, k) => (
                                    <Grid.Column mobile={16} tablet={5} computer={5} key={k}
                                    >
                                        <Link to={`/BlogItems/${v.direcionNum}`}>
                                            <Card fluid link>
                                                <Image src={v.blogLogoPath} style={{ height: "110px" }} />
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
                    <CardExampleContentBlock></CardExampleContentBlock>
                    <ContactAndAdvertisment></ContactAndAdvertisment>
                    <Header as='h4'>
                        <Icon.Group size='large'>
                            <Icon loading size='large' name='circle notch' />
                            <Icon name='qq' />
                        </Icon.Group>
                        <Icon.Group size='large'>
                            <Icon loading size='large' name='circle notch' />
                            <Icon name='wechat' />
                        </Icon.Group>
                        <Icon.Group size='large'>
                            <Icon loading size='large' name='circle notch' />
                            <Icon name='mail' />
                        </Icon.Group>
                        @联系作者
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default AllBlogCenter