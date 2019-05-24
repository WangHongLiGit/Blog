import React, { Component } from 'react';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    Feed,
    Container,
    Comment,
    Form,
    Button
} from 'semantic-ui-react'

import $ from "jquery";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


//测试图片的引入
import imgPath from '../img/dns.png'
import { handle_change_route } from '../actions';


var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return 'http://127.0.0.1:4000' + path
}


//markdown组件的引入
const ReactMarkdown = require('react-markdown')


class BlogItems extends Component {
    state = {
        input: "",
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
        upNum: ""
    }
    //点击第一层回复按钮
    //1.设置replyNickname,recieverId状态
    handleReplyOneClick(replyNickname, recieverNum) {
        this.setState(
            {
                commentNotReply: false,
                replyNickname: replyNickname,
                textContent: "",
                recieverNum: recieverNum,
                replyOneNotTwo: true
            }
        )
        this.refs.textFile.focus();
    }
    //1.设置replyNickname,recieverId状态
    handleReplyTwoClick(replyNickname, recieverNum, upNum) {
        console.log("scascacsaccacscascascascac", recieverNum, upNum)
        this.setState(
            {
                commentNotReply: false,
                replyNickname: replyNickname,
                textContent: "",
                recieverNum: recieverNum,
                upNum: upNum,
                replyOneNotTwo: false
            }
        )
        this.refs.textFile.focus();
    }
    //输入框状态
    handleTextChange(e) {
        console.log(e.target.value)
        this.setState({ textContent: e.target.value })
    }
    //取消回复
    cancelReply() {
        this.setState({ commentNotReply: true, textContent: "" })
    }

    //两个提交按钮
    submitComment(direcionNum) {
        $.ajax({
            type: "post",
            url: baseUrl.get(`/submitComment`),
            xhrFields: { withCredentials: true },
            data: {
                content: this.state.textContent,
                direcionNum: direcionNum
            },
            dataType: "json",
            success: (data) => {
                this.setState({ commentData: data.commentData.reverse() })
            },
            error: (data) => {
                console.log("错误", data.responseText)

            }
        })
        //点击提交结束后  要清空内容
        this.setState({ textContent: "" })
    }
    submitReply() {
        let replyOneNotTwo = this.state.replyOneNotTwo;
        let direcionNum = this.props.match.params.direcionNum;
        //第一层回复
        if (replyOneNotTwo) {
            $.ajax({
                type: "post",
                url: baseUrl.get(`/replyOne`),
                xhrFields: { withCredentials: true },
                data: {
                    content: this.state.textContent,
                    recieverNum: this.state.recieverNum,
                    direcionNum, direcionNum,
                    recieverNickname: this.state.replyNickname
                },
                dataType: "json",
                success: (data) => {
                    console.log("成功获取ssss到", data.replyOneData)
                    this.setState({ replyOneData: data.replyOneData })
                },
                error: (data) => {
                    console.log("错误", data.responseText)
                }
            })
        } else {
            $.ajax({
                type: "post",
                url: baseUrl.get(`/replyTwo`),
                xhrFields: { withCredentials: true },
                data: {
                    content: this.state.textContent,
                    recieverNum: this.state.recieverNum,
                    upNum: this.state.upNum,
                    direcionNum, direcionNum,
                    recieverNickname: this.state.replyNickname
                },
                dataType: "json",
                success: (data) => {
                    console.log("成功获取ssss到", data.replyTwoData)
                    this.setState({ replyTwoData: data.replyTwoData })
                },
                error: (data) => {
                    console.log("错误", data.responseText)

                }
            })
        }
        //点击提交结束后  要清空内容
        this.setState({ textContent: "" })
    }

    componentWillMount() {
        let direcionNum = this.props.match.params.direcionNum;
        $.ajax({
            type: "get",
            url: baseUrl.get(`/blogItems/${direcionNum}`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            success: (result) => {
                console.log("成功获取到", result.data)
                this.setState(
                    {
                        input: result.data,
                        commentData: result.commentData.reverse(),
                        replyOneData: result.replyOneData,
                        replyTwoData: result.replyTwoData
                    }
                )
            },
            error: (data) => {
                console.log("错误", data.responseText)
            }
        })
    }
    render() {
        let { commentNotReply, replyOneNotTwo, replyNickname, textContent, commentData, replyOneData, replyTwoData } = this.state;
        let direcionNum = this.props.match.params.direcionNum;
        console.log(replyOneData)

        console.log(replyTwoData)
        return (
            <Container text fluid className="textContainer" style={{ marginTop: "20px" }}>

                {/* 博客主要内容 */}
                <ReactMarkdown source={this.state.input} />

                {/* 评论区 */}
                <Comment.Group threaded>
                    <div>
                        <Header as='h3' style={{ fontSize: "1.5rem" }}>
                            <Icon name="comments outline"></Icon>
                            {commentNotReply ? "写些评论吧~" : `回复给${replyNickname}`}
                        </Header>
                        <Form reply>
                            <textarea value={textContent} style={{ height: "9em" }} ref="textFile" onChange={(e) => { this.handleTextChange(e) }} />
                            {
                                commentNotReply ? <Button content="提交评论" labelPosition='left' icon='edit' primary onClick={() => { this.submitComment(direcionNum) }} />
                                    : <Button content="提交回复" labelPosition='left' icon='edit' primary onClick={() => { this.submitReply(replyOneNotTwo) }} />
                            }
                            {commentNotReply ? "" : <Button content="取消回复" primary onClick={() => { this.cancelReply() }} />}
                        </Form>
                        <Header as='h3' style={{ fontSize: "1.4rem" }} dividing>
                            全部评论
                            </Header>
                    </div>
                    {
                        commentData.map((v, k) => (
                            <Comment key={k}>
                                <Comment.Avatar as='a' src={v.avatarPath} />
                                <Comment.Content>
                                    <Comment.Author as='a'>{v.nickname} </Comment.Author>
                                    <Comment.Text>
                                        <p>{v.content}</p>
                                    </Comment.Text>
                                    <Comment.Actions>

                                        {/*点击第一层回复   1.要展示nickname   2.将第一层v.uniqueNum作为状态中的recieverNum*/}
                                        <a onClick={() => { this.handleReplyOneClick(v.nickname, v.uniqueNum) }}>
                                            回复
                                            </a>
                                    </Comment.Actions>
                                </Comment.Content>
                                {
                                    replyOneData.map((v1, k1) => {
                                        if (v.uniqueNum == v1.recieverNum) {
                                            return (
                                                <Comment.Group key={k1} style={{ margin: " -2.5em 0 -1em 1.25em", boxShadow: "-4px 0 0px -3px rgba(34,36,38,.15)" }}>
                                                    <Comment>
                                                        <Comment.Avatar as='a' src={v1.senderAvatarPath} />
                                                        <Comment.Content>
                                                            <Comment.Author as='a'>{v1.senderNickname}<span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(0,0,0,.4)", margin: " 0px 4px" }}> 回复</span>{v1.recieverNickname}</Comment.Author>
                                                            <Comment.Text>{v1.content}</Comment.Text>
                                                            <Comment.Actions>
                                                                {/* 点击的第二层回复  1.要展示senderNickname   2.将第二层v1.uniqueNum作为状态中的recieverNum  将第一层v1.uniqueNum作为状态中的upNum*/}
                                                                <a onClick={() => { this.handleReplyTwoClick(v1.senderNickname, v1.uniqueNum, v.uniqueNum) }}>
                                                                    回复
                                                                    </a>
                                                            </Comment.Actions>
                                                        </Comment.Content>
                                                    </Comment>
                                                    {
                                                        replyTwoData.map((v2, k2) => {
                                                            // 确定第一层对象
                                                            if (v.uniqueNum == v2.upNum) {
                                                                //确定第二层上边的回复者
                                                                if (v1.uniqueNum == v2.recieverNum) {
                                                                    return (
                                                                        <Comment.Group key={k2} style={{ padding: " 2em 0 1em 2.25em", boxShadow: "-4px 0 0px -3px rgba(34,36,38,.15)" }}>
                                                                            <Comment>
                                                                                <Comment.Avatar as='a' src={v2.senderAvatarPath} />
                                                                                <Comment.Content>
                                                                                    <Comment.Author as='a'>{v2.senderNickname}<span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(0,0,0,.4)", margin: " 0px 4px" }}> 回复 </span>{v2.recieverNickname}</Comment.Author>
                                                                                    <Comment.Text>{v2.content}</Comment.Text>
                                                                                    <Comment.Actions>
                                                                                        {/* 点击的第二层回复  1.要展示senderNickname   2.将第二层v1.uniqueNum作为状态中的recieverNum  将第一层v1.uniqueNum作为状态中的upNum*/}
                                                                                        <a onClick={() => { this.handleReplyTwoClick(v2.senderNickname, v1.uniqueNum, v.uniqueNum) }}>
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
            </Container>
        )
    }
}

export default BlogItems