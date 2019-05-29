import React, { Component } from 'react'
import AvatarModal from "../component/AvatarModal"
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux"
import { Button, Form, Grid, Header, Image, Message, Segment, Input } from 'semantic-ui-react'
import ContactAndAdvertisment from '../component/ContactAndAdvertisment'
import $ from "jquery"
import { handle_account_input, handle_password_input, handle_login_click,handle_change_route,handle_push_history} from "../actions"

var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return 'http://127.0.0.1:4000' + path
}


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});
class userCenter extends Component {
    state = {
        nickname: "",
        iconName: "paw",
        nicknameInputRed: false,
        nicknameDangerText: ""
    }
    // handleNickNameChange(e) {
    //     this.setState({ nickname: e.target.value, nicknameInputRed: false })
    // }
    handleNickNameFocus(e) {
        // this.setState({ iconName: "edit outline" })
        this.setState({ iconName: "paw", nicknameInputRed: true, nicknameDangerText: "暂时不可更改昵称...功能正在开发中...." })
    }
    handleNickNameBlur(e) {
        // if (this.state.nickname.length == 0) {
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
        //             console.log("更改成功")
        //         },
        //         error: (data) => {
        //             console.log("错误", data.responseText)
        //         }
        //     })
        // }
        this.setState({ iconName: "paw", nicknameInputRed: false, nicknameDangerText: "" })
    }
    componentWillMount() {
        this.props.handlePushHistory(this.props.historyArr,"/userCenter")
        $.ajax({
            type: "get",
            url: baseUrl.get(`/getInfo/nickname`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            success: (result) => {
                this.setState({ nickname: result.nickname })
            },
            error: (data) => {
                if (data.responseJSON.code == 302) {
                    this.props.history.push("/Login")
                }
            }
        })
    }
    render() {
        let { nicknameInputRed, nicknameDangerText } = this.state;
        return (
            <div>

                <Grid textAlign='center' style={{ height: '100%', margin: "34px 0px" }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={7} computer={7}>

                        <Grid.Column>
                            <Header as='h2' color='black' textAlign='left' style={{ paddingLeft: "15px" }}>
                                @各人信息
                                <p style={{ color: "#2185d0", fontSize: "0.8rem" }}>系统自动给您分配了头像</p>
                                <p style={{ color: "#2185d0", fontSize: "0.8rem" }}>您也可以点击更改</p>
                            </Header>
                        </Grid.Column>
                        <Grid.Column>
                            <AvatarModal></AvatarModal>
                        </Grid.Column>
                        <Grid.Column style={{ marginTop: "30px",textAlign:"center"}}>
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
                            </Form>
                            <span style={{ color: "rgb(33, 133, 208)", height: "20px", display: "block"}}>{nicknameInputRed ? nicknameDangerText : ""}</span>
                        </Grid.Column>
                    </Grid.Column>
                    <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={1} computer={1} style={{ padding: "0px" }}>
                    </Grid.Column>
                    <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={8} computer={8}>
                        <ContactAndAdvertisment></ContactAndAdvertisment>
                    </Grid.Column>
                </Grid>

            </div>
        )
    }
}



//
export default connect(
    state => {
        return {
            historyArr:state.historyArr,
        }
    },
    dispatch => ({
        handlePushHistory: function (historyArr,newRoute) {
            dispatch(handle_push_history(historyArr,newRoute))
        },
    })
)(withStyles(styles)(userCenter))


