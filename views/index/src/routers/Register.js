import React, { Component } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import ContactAndAdvertisment from '../component/ContactAndAdvertisment'
import {Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { handle_nickname_input,handle_account_input, handle_password_input, handle_register_click,handle_change_route} from "../actions"

class Regiser extends Component {
    goBack(){
        this.props.history.goBack()
    }
    render() {
        const { messageShow,nicknameInput,accoutInput, passwordInput, danger,handleNicknameInput, handleAccountInput,handlePasswordInput,handleRegisterClick,handleChangeRoute} = this.props;
        const { accoutNumber} = accoutInput;
        const { passwordNumber } = passwordInput;
        const { nickname } = nicknameInput;
        const history=this.props.history;

        const { passwordInputRed, accoutInputRed, nicknameInputRed,dangerText } = danger;

        return (
            <div className='login-form'>
                <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}
                </style>
                <Grid textAlign='center' style={{ height: '100%',margin: "6px 0px 34px" }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={7} computer={7}>
                        <Header as='h3' color='black' textAlign='left' style={{fontSize: "1.5rem",paddingLeft: "15px",fontWeight:"700"}}>
                            <Button icon='arrow alternate circle left outline' basic circular onClick={()=>{this.goBack()}}  /> 注册账号
                    </Header>
                        <Form size='huge'>
                            <Segment stacked >
                                <span style={{ color: "red", height: "20px", display: "block", float: "left", marginTop: "-9px",fontSize:" 0.9rem"}}>{accoutInputRed ? dangerText : ""}</span>

                                <Form.Input
                                    value={accoutNumber}
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='请设置5~12位数字账号'
                                    style={{ height: "50px", position: "relative" }}
                                    error={accoutInputRed}
                                    onChange={(event) => { handleAccountInput(event.target.value, danger, accoutInput) }}
                                />


                                <span style={{ color: "red", height: "20px", display: "block", marginTop: "-12px", float: "left",fontSize:" 0.9rem"}}>{passwordInputRed ? dangerText : ""}</span>

                                <Form.Input
                                    fluid
                                    value={passwordNumber}
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='请设置密码'
                                    type='password'
                                    style={{ height: "50px", margin: "0px" }}
                                    error={passwordInputRed}
                                    onChange={(event) => { handlePasswordInput(event.target.value, danger, passwordInput) }}
                                />

                                <span style={{ color: "red", height: "20px", display: "block", marginTop: "-12px", float: "left",fontSize:" 0.9rem"}}>{nicknameInputRed ? dangerText : ""}</span>

                                <Form.Input
                                    fluid
                                    value={nickname}
                                    icon='paw'
                                    iconPosition='left'
                                    placeholder='昵称'
                                    style={{ height: "50px", margin: "0px" }}
                                    error={nicknameInputRed}
                                    onChange={(event) => { handleNicknameInput(event.target.value, danger, nicknameInput) }}
                                />
                                <Button color='black' fluid size='large' onClick={() => { handleRegisterClick(accoutInput, passwordInput,nicknameInput,danger,history,messageShow) }}>
                                注册
                                </Button>
                                <Message>
                                    已经注册过账号?
                                        <Link to="/Login"  onClick={()=>{handleChangeRoute(accoutInput, passwordInput, nicknameInput,danger)}}>直接登录</Link>
                                </Message>
                            </Segment>
                        </Form>

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
export default connect(
    state => {
        return {
            nicknameInput:state.nicknameInput,
            accoutInput: state.accoutInput,
            passwordInput: state.passwordInput,
            danger: state.danger,
            messageShow:state.messageShow,
        }
    },
    dispatch => ({
        handleNicknameInput: function (value, danger, nicknameInput) {
            dispatch(handle_nickname_input(value, danger, nicknameInput))
        },
        handleAccountInput: function (value, danger, accoutInput) {
            dispatch(handle_account_input(value, danger, accoutInput))
        },
        handlePasswordInput: function (value, danger, passwordInput) {
            dispatch(handle_password_input(value, danger, passwordInput))
        },
        handleRegisterClick: function (accoutInput,passwordInput,nicknameInput, danger,history,messageShow) {
            dispatch(handle_register_click(accoutInput,passwordInput,nicknameInput,danger,history,messageShow))
        },
        handleChangeRoute: function (accoutInput, passwordInput, nicknameInput,danger) {
            dispatch(handle_change_route(accoutInput, passwordInput, nicknameInput,danger))
        },
    })
)(Regiser)




