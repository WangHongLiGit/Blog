import React, { Component } from 'react';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    Container,
    Comment,
    Form,
    Button,
    Label
} from 'semantic-ui-react'

import $ from "jquery";

import ConnectMe from "../component/ConnectMe"


import { connect } from 'react-redux';
import { handle_push_history,handle_message_show} from "../actions"


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



class TalkCenter extends Component {
    state = {
        //评论状态还是回复状态
        commentNotReply: true,
        //第一层回复还是第二层回复
        replyOneNotTwo: true,


        replyNickname: "",
        textContent: "",
        commentData: [],
        replyOneData: [],
        replyTwoData: [],

        //下面的状态是提交评论数据
        // 接收者id
        recieverNum: "",
        //上一层id
        upNum: "",

        loading: false,

    }
    //点击第一层回复按钮
    //1.设置replyNickname,recieverId状态
    handleReplyOneClick(replyNickname, recieverNum, senderId) {
        this.setState(
            {
                commentNotReply: false,
                replyNickname: replyNickname,
                textContent: "",
                recieverNum: recieverNum,
                reciverId: senderId,
                replyOneNotTwo: true
            }
        )
        this.refs.textFile.focus();
    }
    //1.设置replyNickname,recieverId状态
    handleReplyTwoClick(replyNickname, recieverNum, upNum, senderId) {
        this.setState(
            {
                commentNotReply: false,
                replyNickname: replyNickname,
                textContent: "",
                recieverNum: recieverNum,
                reciverId: senderId,
                upNum: upNum,
                replyOneNotTwo: false,
            }
        )
        this.refs.textFile.focus();
    }
    //输入框状态
    handleTextChange(e) {
        this.setState({ textContent: e.target.value })
    }
    //取消回复
    cancelReply() {
        this.setState({ commentNotReply: true, textContent: "" })
    }

    //两个提交按钮
    submitComment() {
        if (this.state.textContent.length !== 0) {
            $.ajax({
                type: "post",
                url: baseUrl.get(`/submitTalkComment`),
                xhrFields: { withCredentials: true },
                data: {
                    content: this.state.textContent,
                },
                dataType: "json",
                success: (data) => {
                    this.setState({ commentData: data.commentData.reverse() })
                },
                error: (data) => {
                    if (data.responseJSON.code === 302) {
                        this.props.history.push("/Login")
                    }
                }
            })
        }
        //点击提交结束后  要清空内容
        this.setState({ textContent: "" })
    }
    submitTalkReply() {
        let replyOneNotTwo = this.state.replyOneNotTwo;
        //第一层回复
        if (this.state.textContent.length !== 0) {
            if (replyOneNotTwo) {
                $.ajax({
                    type: "post",
                    url: baseUrl.get(`/talkReplyOne`),
                    xhrFields: { withCredentials: true },
                    data: {
                        content: this.state.textContent,
                        recieverNum: this.state.recieverNum,
                        reciverId: this.state.reciverId,
                        recieverNickname: this.state.replyNickname
                    },
                    dataType: "json",
                    success: (data) => {
                        this.setState({ replyOneData: data.replyOneData })
                    },
                    error: (data) => {
                        if (data.responseJSON.code === 302) {
                            this.props.history.push("/Login")
                        }
                    }
                })
            } else {
                $.ajax({
                    type: "post",
                    url: baseUrl.get(`/talkReplyTwo`),
                    xhrFields: { withCredentials: true },
                    data: {
                        content: this.state.textContent,
                        recieverNum: this.state.recieverNum,
                        reciverId: this.state.reciverId,
                        upNum: this.state.upNum,
                        recieverNickname: this.state.replyNickname
                    },
                    dataType: "json",
                    success: (data) => {
                        this.setState({ replyTwoData: data.replyTwoData })
                    },
                    error: (data) => {
                        if (data.responseJSON.code === 302) {
                            this.props.history.push("/Login")
                        }
                    }
                })
            }
        }
        //点击提交结束后  要清空内容
        this.setState({ textContent: "" })
    }

    componentWillMount() {
        this.props.handlePushHistory(this.props.historyArr, "/TalkCenter")
        let random = (Math.floor(Math.random() * 900) + 100).toString();
        let{ messageShow,handleMessageShow} = this.props;
        $.ajax({
            type: "get",
            url: baseUrl.get(`/talkCenter`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            beforeSend: () => {
                this.setState({ loading: true })
            },
            success: (result) => {
                this.setState(
                    {
                        commentData: result.commentData.reverse(),
                        replyOneData: result.replyOneData,
                        replyTwoData: result.replyTwoData,
                        random: random
                    }
                )
                window.setTimeout(() => {
                    this.setState(
                        {
                            loading: false
                        }
                    )
                }
                    , 600)
                handleMessageShow(messageShow,"登录之后才能评论哦~")
            }
        })
    }
    render() {
        //为了使每次的图片路径不一样  可以使用户更改完头像后技术更新  如果前后两次的路径是一样的话  浏览器有缓存就不会发送请求
        let { random, loading, commentNotReply, replyOneNotTwo, replyNickname, textContent, commentData, replyOneData, replyTwoData } = this.state;
        return (

            <Grid container style={{ marginTop: "7px", minHeight: "800px", borderBottom: "2px solid rgba(34,36,38,.15)" }}>
                {/* 左侧数据 12格*/}


                <Grid.Column mobile={16} tablet={12} computer={12} style={{ padding: "0px" }}
                >


                    <Container text fluid className="textContainer" style={{ marginTop: "20px" }}>
                        {/* 评论区 */}
                        <Comment.Group threaded size='small'  >
                            <div>
                                <Header as='h3' style={{ fontSize: "1.5rem" }}>
                                    <Icon name="comments outline"></Icon>
                                    {commentNotReply ? "写些留言吧~" : `回复给${replyNickname}`}
                                </Header>
                                <Form reply>
                                    <textarea value={textContent} style={{ height: "9em" }} ref="textFile" onChange={(e) => { this.handleTextChange(e) }} />
                                    {
                                        commentNotReply ? <Button content="提交评论" labelPosition='left' icon='edit' primary onClick={() => { this.submitComment() }} />
                                            : <Button content="提交回复" labelPosition='left' icon='edit' primary onClick={() => { this.submitTalkReply(replyOneNotTwo) }} />
                                    }
                                    {commentNotReply ? "" : <Button content="取消回复" primary onClick={() => { this.cancelReply() }} />}
                                </Form>
                                <Header as='h3' style={{ fontSize: "1.4rem" }} dividing>
                                    全部评论
                            </Header>
                            </div>
                            {loading ?
                                <div className="loaderDiv" >
                                    <div className="loader" style={{ top: "30%" }}>
                                        <span className="text">Loading</span>
                                        <span className="spinner"></span>
                                    </div>
                                </div>
                                :
                                commentData.map((v, k) => (
                                    <Comment key={k}>
                                        <Comment.Avatar as='a' src={v.avatarPath + random} />
                                        <Comment.Content>
                                            <Comment.Author as='a'>
                                                {v.nickname}
                                                {
                                                    v.senderId === "111111111111111111111111" ?
                                                                <Label as='a' color='teal' size="tiny" className="nickLable" style={{padding: "3px",height: "1rem", marginLeft: "0.2rem" }}>
                                                            博主
                                                </Label> : ""
                                                }
                                            </Comment.Author>
                                            <Comment.Text>
                                                <p>{v.content}</p>
                                            </Comment.Text>
                                            <Comment.Actions>

                                                {/*点击第一层回复   1.要展示nickname   2.将第一层v.uniqueNum作为状态中的recieverNum*/}
                                                <a onClick={() => { this.handleReplyOneClick(v.nickname, v.uniqueNum, v.senderId) }}>
                                                    回复
                                            </a>
                                            </Comment.Actions>
                                        </Comment.Content>
                                        {
                                            replyOneData.map((v1, k1) => {
                                                if (v.uniqueNum === v1.recieverNum) {
                                                    return (
                                                        <Comment.Group size='small' key={k1} style={{ margin: " -2.5em 0 -1em 1.25em", boxShadow: "-4px 0 0px -3px rgba(34,36,38,.15)" }}>
                                                            <Comment>
                                                                <Comment.Avatar as='a' src={v1.senderAvatarPath + random} />
                                                                <Comment.Content>
                                                                    <Comment.Author as='a'>
                                                                        {v1.senderNickname}
                                                                        {
                                                                            v1.senderId === "111111111111111111111111" ?
                                                                                        <Label as='a' color='teal' size="tiny" className="nickLable" style={{padding: "3px",height: "1rem", marginLeft: "0.2rem" }}>
                                                                                    博主
                                                                        </Label> : ""
                                                                        }
                                                                        <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(0,0,0,.4)", margin: " 0px 4px" }}> 回复</span>
                                                                        {v1.recieverNickname}                                                                {
                                                                            v1.reciverId === "111111111111111111111111" ?
                                                                                        <Label as='a' color='teal' size="tiny" className="nickLable" style={{padding: "3px",height: "1rem", marginLeft: "0.2rem" }}>
                                                                                    博主
                                                                        </Label> : ""
                                                                        }
                                                                    </Comment.Author>
                                                                    <Comment.Text>{v1.content}</Comment.Text>
                                                                    <Comment.Actions>
                                                                        {/* 点击的第二层回复  1.要展示senderNickname   2.将第二层v1.uniqueNum作为状态中的recieverNum  将第一层v1.uniqueNum作为状态中的upNum*/}
                                                                        <a onClick={() => { this.handleReplyTwoClick(v1.senderNickname, v1.uniqueNum, v.uniqueNum, v1.senderId) }}>
                                                                            回复
                                                                    </a>
                                                                    </Comment.Actions>
                                                                </Comment.Content>
                                                            </Comment>
                                                            {
                                                                replyTwoData.map((v2, k2) => {
                                                                    // 确定第一层对象
                                                                    if (v.uniqueNum === v2.upNum) {
                                                                        //确定第二层上边的回复者
                                                                        if (v1.uniqueNum === v2.recieverNum) {
                                                                            return (
                                                                                <Comment.Group size='small' key={k2} style={{ padding: " 2em 0 1em 2.25em", boxShadow: "-4px 0 0px -3px rgba(34,36,38,.15)" }}>
                                                                                    <Comment>
                                                                                        <Comment.Avatar as='a' src={v2.senderAvatarPath + random} />
                                                                                        <Comment.Content>
                                                                                            <Comment.Author as='a'>
                                                                                                {v2.senderNickname}
                                                                                                {
                                                                                                    v2.senderId === "111111111111111111111111" ?
                                                                                                                <Label as='a' color='teal' size="tiny" className="nickLable" style={{padding: "3px",height: "1rem", marginLeft: "0.2rem" }}>
                                                                                                            博主
                                                                                                </Label> : ""
                                                                                                }
                                                                                                <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(0,0,0,.4)", margin: " 0px 4px" }}> 回复 </span>
                                                                                                {v2.recieverNickname}
                                                                                                {v2.reciverId === "111111111111111111111111" ?
                                                                                                            <Label as='a' color='teal' size="tiny" className="nickLable" style={{padding: "3px",height: "1rem", marginLeft: "0.2rem" }}>
                                                                                                        博主
                                                                                                </Label> : ""
                                                                                                }
                                                                                            </Comment.Author>
                                                                                            <Comment.Text>{v2.content}</Comment.Text>
                                                                                            <Comment.Actions>
                                                                                                {/* 点击的第二层回复  1.要展示senderNickname   2.将第二层v1.uniqueNum作为状态中的recieverNum  将第一层v1.uniqueNum作为状态中的upNum*/}
                                                                                                <a onClick={() => { this.handleReplyTwoClick(v2.senderNickname, v1.uniqueNum, v.uniqueNum, v2.senderId) }}>
                                                                                                    回复
                                                                                        </a>
                                                                                            </Comment.Actions>
                                                                                        </Comment.Content>
                                                                                    </Comment>
                                                                                </Comment.Group>

                                                                            )
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        </Comment.Group>
                                                    )
                                                }
                                            })
                                        }
                                    </Comment>
                                ))
                            }
                        </Comment.Group>
                        <Divider style={{ marginTop: "50px" }}></Divider>
                    </Container>
                </Grid.Column>
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
            messageShow:state.messageShow
        }
    },
    dispatch => ({
        handleMessageShow: function (messageShow, message) {
            dispatch(handle_message_show(messageShow, message))
        },
        handlePushHistory: function (historyArr, newRoute) {
            dispatch(handle_push_history(historyArr, newRoute))
        },
    })
)(TalkCenter)