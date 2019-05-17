import React, { Component } from 'react';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    Feed
} from 'semantic-ui-react'

//测试图片的引入
import imgPath from '../img/dns.png'

import ContactAndAdvertisment from '../component/ContactAndAdvertisment'
import Support from '../component/Support'


//1.左侧博文数据
const extra = (
    <a>
        <Icon name='user' />
        16 Friends
    </a>
)
const CardExampleCardProps = () => (
    <Card
        fluid
        image={imgPath}
        header='Elliot Baker'
        meta='Friend'
        description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
        extra={extra}
    />
)

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


class HomeCenter extends Component {
    render() {
        return (
            <Grid container style={{ margin: "32px" }}>

                {/* 左侧的博客展示 */}
                <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}>
                    <Grid columns={16} style={{ padding: "0px" }}>
                        <Grid.Column mobile={16} tablet={16} computer={15} style={{ padding: "0px" }}>
                            <Header as='h3'>
                                <Icon name='hotjar' />
                                <Header.Content>热门博文</Header.Content>
                            </Header>
                            <Divider />
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <CardExampleCardProps></CardExampleCardProps>
                        </Grid.Column>
                    </Grid>
                </Grid.Column>


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

                <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}>
                    <Support></Support>
                </Grid.Column>
            </Grid>



        )
    }
}

export default HomeCenter