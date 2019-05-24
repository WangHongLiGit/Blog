import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import ContactAndAdvertisment from '../component/ContactAndAdvertisment'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import { connect } from 'react-redux';
import { handle_account_input, handle_password_input, handle_login_click,handle_change_route} from "../actions"

class Login extends Component {
    render() {
        const { nicknameInput,accoutInput, passwordInput, danger, handleAccountInput,handlePasswordInput,handleLoginClick,handleChangeRoute} = this.props;
        const { accoutNumber, isAccoutExist, isAccoutCorrect } = accoutInput;
        const { passwordNumber, isPasswordCorrect } = passwordInput;
        const { passwordInputRed, accoutInputRed, dangerText } = danger;

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
                <Grid textAlign='center' style={{ height: '100%', margin: "34px 0px" }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={7} computer={7}>
                        <Header as='h2' color='black' textAlign='left' style={{ paddingLeft: "15px" }}>
                            <Button icon='arrow alternate circle left outline' basic circular /> 账号登录
                    </Header>
                        <Form size='huge'>
                            <Segment stacked >
                            <span style={{ color: "red",height:"20px",display:"block",float:"left",marginTop:"-9px"}}>{accoutInputRed?dangerText:""}</span>

                                <Form.Input
                                    value={accoutNumber}
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='5~12位数字账号'
                                    style={{ height: "50px",position:"relative"}}
                                    error={accoutInputRed}
                                    onChange={(event) => { handleAccountInput(event.target.value, danger, accoutInput) }}
                                />
                                

                                <span style={{ color: "red",height:"20px",display:"block",marginTop:"-12px",float:"left"}}>{passwordInputRed?dangerText:""}</span>

                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='请输入密码'
                                    type='password'
                                    style={{ height: "50px", margin: "0px" }}
                                    error={passwordInputRed}
                                    onChange={(event) => { handlePasswordInput(event.target.value, danger, passwordInput) }}
                                />
                                <Button color='black' fluid size='large' onClick={() => { handleLoginClick(accoutInput,passwordInput, danger)}}>
                                    登录
                </Button>
                                <Message>
                                    还没有账号? <Link to="/Register" onClick={()=>{handleChangeRoute(accoutInput, passwordInput, nicknameInput,danger)}}>注册</Link>
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
        }
    },
    dispatch => ({
        handleAccountInput: function (value, danger, accoutInput) {
            dispatch(handle_account_input(value, danger, accoutInput))
        },
        handlePasswordInput: function (value, danger, passwordInput) {
            dispatch(handle_password_input(value, danger, passwordInput))
        },
        handleLoginClick: function (accoutInput,passwordInput, danger) {
            dispatch(handle_login_click(accoutInput,passwordInput, danger))
        },
        handleChangeRoute: function (accoutInput, passwordInput, nicknameInput,danger) {
            dispatch(handle_change_route(accoutInput, passwordInput, nicknameInput,danger))
        }
    })
)(Login)