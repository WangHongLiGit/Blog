import React, { Component } from 'react';
import {
    Divider,
    Header,
    Icon,
    Comment,
    Form,
    Button,
    Label,
    Grid,
    Card,
    Image
} from 'semantic-ui-react'

import $ from "jquery";
import ConnectMe from "../component/ConnectMe"
import { connect } from 'react-redux';
import noComment from "../img/noComment.jpg";


import ThanksPay from "../component/ThanksPay"

//测试图片的引入

import { handle_push_history, change_comment_area, handle_message_show, handle_change_up} from "../actions"



//markdown组件的引入
import marked from 'marked'
import highlight from 'highlight.js'
import 'highlight.js/styles/agate.css';

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    highlight: (code) => highlight.highlightAuto(code).value // 这段代码
});
var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return '' + path
}


//3.单独右侧广告位
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




class BlogItems extends Component {
    state = {
        input: "",
        //评论状态还是回复状态
        commentNotReply: true,
        //第一层回复还是第二层回复
        replyOneNotTwo: true,


        replyNickname: "",
        commentData: [],
        replyOneData: [],
        replyTwoData: [],

        //下面的状态是提交评论数据
        // 接收者的唯一号码
        recieverNum: "",
        //接收者的id
        reciverId: "",
        //上一层id
        upNum: ""
    }
    //回到顶部
    returnUp() {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        })
    }
    //点击第一层回复按钮
    //1.设置replyNickname,recieverId状态
    handleReplyOneClick(replyNickname, recieverNum, senderId) {
        this.setState(
            {
                commentNotReply: false,
                replyNickname: replyNickname,
                recieverNum: recieverNum,
                reciverId: senderId,
                replyOneNotTwo: true
            }
        )
        //切换回复的时候  我们要将内容清空
        this.props.changeCommentArea("")
        this.refs.textFile.focus();
    }
    //1.设置replyNickname,recieverId状态
    handleReplyTwoClick(replyNickname, recieverNum, upNum, senderId) {
        this.setState(
            {
                commentNotReply: false,
                replyNickname: replyNickname,
                recieverNum: recieverNum,
                reciverId: senderId,
                upNum: upNum,
                replyOneNotTwo: false
            }
        )
        //切换回复的时候  我们要将内容清空
        this.props.changeCommentArea("")
        this.refs.textFile.focus();
    }
    //输入框状态
    handleTextChange(e) {
        this.props.changeCommentArea(e.target.value)
    }
    //取消回复
    cancelReply() {
        this.setState({ commentNotReply: true })
        //切换回复的时候  我们要将内容清空
        this.props.changeCommentArea("")
    }
    //回到顶部
    returnUp() {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        })
    }
    //两个提交按钮
    submitComment() {
        let textContent = this.props.commetTextArea;
        let pathArr = this.props.location.pathname.split("/");
        let direcionName = pathArr[2];
        let direcionNum = pathArr[3];
        let { messageShow, handleMessageShow } = this.props;
        if (textContent.length !== 0) {
            $.ajax({
                type: "post",
                url: baseUrl.get(`/submitComment`),
                xhrFields: { withCredentials: true },
                data: {
                    content: textContent,
                    direcionName: direcionName,
                    direcionNum: direcionNum
                },
                dataType: "json",
                success: (data) => {
                    this.setState({ commentData: data.commentData.reverse() })
                },
                error: (data) => {
                    if (data.responseJSON.code === 302) {
                        handleMessageShow(messageShow, "登录之后才能评论哦~")
                        this.props.history.push("/Login")
                    }
                }
            })
        }
        //点击提交结束后  要清空内容
        this.props.changeCommentArea("")
    }
    submitReply() {
        let textContent = this.props.commetTextArea;
        let replyOneNotTwo = this.state.replyOneNotTwo;
        let pathArr = this.props.location.pathname.split("/");
        let direcionName = pathArr[2];
        let direcionNum = pathArr[3];
        let { messageShow, handleMessageShow } = this.props;
        if (textContent.length !== 0) {
            //第一层回复
            if (replyOneNotTwo) {

                $.ajax({
                    type: "post",
                    url: baseUrl.get(`/replyOne`),
                    xhrFields: { withCredentials: true },
                    data: {
                        content: textContent,
                        recieverNum: this.state.recieverNum,
                        reciverId: this.state.reciverId,
                        direcionName: direcionName,
                        direcionNum, direcionNum,
                        recieverNickname: this.state.replyNickname,
                    },
                    dataType: "json",
                    success: (data) => {
                        this.setState({ replyOneData: data.replyOneData, commentNotReply: true })
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
                    url: baseUrl.get(`/replyTwo`),
                    xhrFields: { withCredentials: true },
                    data: {
                        content: textContent,
                        recieverNum: this.state.recieverNum,
                        reciverId: this.state.reciverId,
                        upNum: this.state.upNum,
                        direcionName: direcionName,
                        direcionNum, direcionNum,
                        recieverNickname: this.state.replyNickname
                    },
                    dataType: "json",
                    success: (data) => {
                        this.setState({ replyTwoData: data.replyTwoData, commentNotReply: true })
                    },
                    error: (data) => {
                        if (data.responseJSON.code === 302) {
                            handleMessageShow(messageShow, "登录之后才能评论哦~")
                            this.props.history.push("/Login")
                        }

                    }
                })
            }
        }
        //点击提交结束后  要清空内容
        this.props.changeCommentArea("")
    }

    componentWillMount() {
        this.returnUp()
        let random = (Math.floor(Math.random() * 900) + 100).toString();
        let pathArr = this.props.location.pathname.split("/");
        let direcionName = pathArr[2];
        let direcionNum = pathArr[3];
        this.props.handlePushHistory(this.props.historyArr, this.props.location.pathname)
        this.props.handleChangeUp(!(window.location.hash === "#/"))
        $.ajax({
            type: "get",
            url: baseUrl.get(`/getBlogItem/${direcionName}/${direcionNum}`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            beforeSend: () => {
                this.setState({ loading: true })
            },
            success: (result) => {
                //使a的跳转  设置成_blank  使可以重新刷新网页
                let markedInput=marked(result.data);
                let exp=new RegExp("<a",'g')
                let repalcedInput=markedInput.replace(exp,"<a target='_blank'  ")
                this.setState(
                    {
                        input: repalcedInput,
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
            },
            error: (data) => {
                console.log("错误", data.responseText)
            }
        })
    }
    render() {
        //为了使每次的图片路径不一样  可以使用户更改完头像后技术更新  如果前后两次的路径是一样的话  浏览器有缓存就不会发送请求
        let { random, loading, input, commentNotReply, replyOneNotTwo, replyNickname, commentData, replyOneData, replyTwoData } = this.state;
        let textContent = this.props.commetTextArea;
        return (
            <Grid container style={{ marginTop: "5px" }}>
                {
                    loading ?
                        <Grid.Column mobile={16} tablet={10} computer={10} style={{ padding: "0px" }}>
                            <div className="loaderDiv" >
                                <div className="loader" style={{ top: "20%" }}>
                                    <span className="text">Loading</span>
                                    <span className="spinner"></span>
                                </div>
                            </div>
                        </Grid.Column>
                        :
                        <Grid.Column mobile={16} tablet={10} computer={10}
                        >
                            <div>
                                {/* 内容区 */}
                                <div dangerouslySetInnerHTML={{ __html:input}}
                                >
                                </div>
                                <Divider></Divider>
                                {/* 赞赏区 */}
                                <ThanksPay></ThanksPay>
                                <Divider></Divider>
                                {/* 评论区 */}
                                <Comment.Group size='small' threaded>
                                    <div>
                                        <Header as='h3' style={{ fontSize: "1.5rem" }}>
                                            <Icon name="comments outline"></Icon>
                                            {commentNotReply ? "写些评论吧~" : `回复给${replyNickname}`}
                                        </Header>
                                        <Form reply>
                                            <textarea value={textContent} style={{ height: "9em" }} ref="textFile" onChange={(e) => { this.handleTextChange(e) }} />
                                            {
                                                commentNotReply ? <Button content="提交评论" labelPosition='left' icon='edit' primary onClick={() => { this.submitComment() }} />
                                                    : <Button content="提交回复" labelPosition='left' icon='edit' primary onClick={() => { this.submitReply(replyOneNotTwo) }} />
                                            }
                                            {commentNotReply ? "" : <Button content="取消回复" primary onClick={() => { this.cancelReply() }} />}
                                        </Form>
                                        <Header as='h3' style={{ fontSize: "1.4rem" }} dividing>
                                            全部评论
                            </Header>
                                    </div>
                                    {
                                        commentData.length === 0 ?
                                            <Image src={noComment}></Image>
                                            :
                                            commentData.map((v, k) => (
                                                <Comment key={k}>
                                                    <Comment.Avatar as='a' src={v.avatarPath + random} />
                                                    <Comment.Content>
                                                        <Comment.Author as='a'>{v.nickname}
                                                            {
                                                                v.senderId === "111111111111111111111111" ?
                                                                    <Label as='a' color='teal' size="tiny" className="nickLable" style={{ padding: "3px", height: "1rem", marginLeft: "0.2rem" }}>
                                                                        博主 </Label> : ""
                                                            }
                                                        </Comment.Author>
                                                        <Comment.Text>
                                                            <p>{v.content}</p>
                                                        </Comment.Text>
                                                        <Comment.Actions>

                                                            {/*点击第一层回复   1.要展示nickname   2.将第一层v.uniqueNum作为状态中的recieverNum  3.将v.senderId作为状态中的reciverId*/}
                                                            <a style={{ color: '#3399ea' }} onClick={() => { this.handleReplyOneClick(v.nickname, v.uniqueNum, v.senderId) }}>
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
                                                                                            <Label as='a' color='teal' size="tiny" className="nickLable" style={{ padding: "3px", height: "1rem", marginLeft: "0.2rem" }}>
                                                                                                博主
                                                                        </Label> : ""
                                                                                    }
                                                                                    <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(0,0,0,.4)", margin: " 0px 4px", color: "#3399ea" }}>回复</span>
                                                                                    {v1.recieverNickname}
                                                                                    {
                                                                                        v1.reciverId === "111111111111111111111111" ?
                                                                                            <Label as='a' color='teal' size="tiny" className="nickLable" style={{ padding: "3px", height: "1rem", marginLeft: "0.2rem" }}>
                                                                                                博主
                                                                        </Label> : ""
                                                                                    }
                                                                                </Comment.Author>
                                                                                <Comment.Text>{v1.content}</Comment.Text>
                                                                                <Comment.Actions>
                                                                                    {/* 点击的第二层回复  1.要展示senderNickname   2.将第二层v1.uniqueNum作为状态中的recieverNum  将第一层v.uniqueNum作为状态中的upNum*/}
                                                                                    <a style={{ color: '#3399ea' }} onClick={() => { this.handleReplyTwoClick(v1.senderNickname, v1.uniqueNum, v.uniqueNum, v1.senderId) }}>
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
                                                                                                                    <Label as='a' color='teal' size="tiny" className="nickLable" style={{ padding: "3px", height: "1rem", marginLeft: "0.2rem" }}>
                                                                                                                        博主
                                                                                                </Label> : ""
                                                                                                            }
                                                                                                            <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "rgba(0,0,0,.4)", margin: " 0px 4px", color: "#3399ea" }}> 回复 </span>
                                                                                                            {v2.recieverNickname}
                                                                                                            {
                                                                                                                v2.reciverId === "111111111111111111111111" ?
                                                                                                                    <Label as='a' color='teal' size="tiny" className="nickLable" style={{ padding: "3px", height: "1rem", marginLeft: "0.2rem" }}>
                                                                                                                        博主
                                                                                                </Label> : ""
                                                                                                            }
                                                                                                        </Comment.Author>
                                                                                                        <Comment.Text>{v2.content}</Comment.Text>

                                                                                                        <Comment.Actions>
                                                                                                            {/* 点击的第二层回复  1.要展示senderNickname   2.将第二层v1.uniqueNum作为状态中的recieverNum  将第一层v1.uniqueNum作为状态中的upNum*/}
                                                                                                            <a style={{ color: '#3399ea' }} onClick={() => { this.handleReplyTwoClick(v2.senderNickname, v1.uniqueNum, v.uniqueNum, v2.senderId) }}>
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
                            </div>
                        </Grid.Column>
                }

                <Grid.Column mobile={16} tablet={2} computer={2}>
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
            IsSlideUp: state.IsSlideUp,
            historyArr: state.historyArr,
            commetTextArea: state.commetTextArea,
            messageShow: state.messageShow
        }
    },
    dispatch => ({
        handleChangeUp: function (IsSlideUp) {
            dispatch(handle_change_up(IsSlideUp))
        },
        handleMessageShow: function (messageShow, message) {
            dispatch(handle_message_show(messageShow, message))
        },
        changeCommentArea: function (value) {
            dispatch(change_comment_area(value))
        },
        handlePushHistory: function (historyArr, newRoute) {
            dispatch(handle_push_history(historyArr, newRoute))
        }
    })
)(BlogItems)