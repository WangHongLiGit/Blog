import React, { Component } from 'react'
import AvatarModal from "../component/AvatarModal"
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux"
import { Button, Form, Grid, Header, Icon,Card,Image} from 'semantic-ui-react'
import ConnectMe from "../component/ConnectMe"

import $ from "jquery"
import { handle_push_history,handle_message_show} from "../actions"
var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return '' + path
}



const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});


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

class userCenter extends Component {
    state = {
        nickname: "",
        iconName: "paw",
        nicknameInputRed: false,
        nicknameDangerText: "",
        user_id: "",
        updateMessage: ""
    }

    updataBlogs() {
        $.ajax({
            type: "get",
            url: baseUrl.get(`/updataBlogs`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            success: (result) => {
                this.setState({ updateMessage: "更新成功" })
            },
            error: (data) => {
                this.setState({ updateMessage: "更新失败" })
            }
        })
    }




    // handleNickNameChange(e) {
    //     this.setState({ nickname: e.target.value, nicknameInputRed: false })
    // }
    handleNickNameFocus(e) {
        // this.setState({ iconName: "edit outline" })
        this.setState({ iconName: "paw", nicknameInputRed: true, nicknameDangerText: "暂时不可更改昵称...功能正在开发中...." })
    }
    handleNickNameBlur(e) {
        // if (this.state.nickname.length === 0) {
        //     this.setState({ iconName: "paw", nicknameInputRed: true, nicknameDangerText: "昵称不能设置为空哦~" })
        // } else {
        //     this.setState({ iconName: "paw", nicknameInputRed: false, nicknameDangerText: "" })
        //     $.ajax({
        //         type: "post",
        //         url: baseUrl.get(`/changeNickName`),
        //         xhrFields: { withCredentials: true },
        //         dataType: "json",
        //         data: { nickname: this.state.nickname },
        //         success: (result) => {
        //         },
        //         error: (data) => {
        //         }
        //     })
        // }
        this.setState({ iconName: "paw", nicknameInputRed: false, nicknameDangerText: "" })
    }
    componentWillMount() {
        this.props.handlePushHistory(this.props.historyArr, "/userCenter")
        $.ajax({
            type: "get",
            url: baseUrl.get(`/getInfo`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            success: (result) => {
                this.setState({
                    nickname: result.nickname,
                    user_id: result._id,
                })
            },
            error: (data) => {
                let{ messageShow,handleMessageShow} = this.props;
                if (data.responseJSON.code === 302) {
                    handleMessageShow(messageShow,"登录之后才能查看个人信息哦~")
                    this.props.history.push("/Login")
                }
            }
        })
    }
    render() {
        let { nicknameInputRed, nicknameDangerText, user_id, updateMessage,messageShow,handleMessageShow} = this.state;
        return (
            <Grid container style={{ marginTop: "15px", minHeight: "700px"}}>
                {/* 左侧数据 12格*/}


                <Grid.Column mobile={16} tablet={10} computer={10} style={{ padding: "0px"}}>

                    <Grid textAlign='center' style={{ minHeight: "700px",marginTop:"20px"}}>
                        <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={7} computer={7}>
                            <Grid.Column>
                                <Header as='h3' color='black' textAlign='left' style={{ fontSize: "1.5rem", paddingLeft: "15px", fontWeight: "700" }}>
                                    @各人信息
                                <p style={{ color: "#2185d0", fontSize: "0.8rem" }}>系统自动给您分配了头像</p>
                                    <p style={{ color: "#2185d0", fontSize: "0.8rem" }}>您也可以点击更改</p>
                                </Header>
                            </Grid.Column>
                            <Grid.Column style={{margin:" 34px 0px"}}>
                                <AvatarModal></AvatarModal>
                            </Grid.Column>
                            <Grid.Column style={{ marginTop: "30px", textAlign: "center" }}>
                                <Form>
                                    <Form.Input
                                        style={{ width: "70%" }}
                                        icon={this.state.iconName}
                                        iconPosition='left' size="big" value={this.state.nickname}
                                        // onChange={(e) => { this.handleNickNameChange(e) }}
                                        onFocus={(e) => { this.handleNickNameFocus(e) }}
                                        onBlur={(e) => { this.handleNickNameBlur(e) }}
                                    // error={this.state.nicknameInputRed}
                                    />
                                    {/* 博主特权按钮 */}
                                    {
                                        user_id === "111111111111111111111111" ?
                                            <Button icon onClick={() => { this.updataBlogs() }}>
                                                <Icon name='world' />
                                                <span style={{ color: "rgb(33, 133, 208)", height: "20px" }}>{updateMessage}</span>
                                            </Button>
                                            : ""
                                    }

                                </Form>

                                <span style={{ color: "rgb(33, 133, 208)", height: "20px", display: "block" }}>{nicknameInputRed ? nicknameDangerText : ""}</span>
                            </Grid.Column>
                        </Grid.Column>




                    </Grid>


                </Grid.Column>
                {/*右侧*/}
                <Grid.Column mobile={16} tablet={2} computer={2}>
                </Grid.Column>
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
)(withStyles(styles)(userCenter))


