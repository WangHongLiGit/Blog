import $ from "jquery";
// import axios from 'axios'

//设置定时器
let timer;
var baseUrl = {}
// http://127.0.0.1:9000
baseUrl.get = function (path) {
    return '' + path
}

export const CHANGE_SINGLE_STATE = "CHANGE_SINGLE_STATE";
export function return_change_single_state_action(stateName, newState) {
    return {
        type: CHANGE_SINGLE_STATE,
        stateName,
        newState
    }
}

export const CHANGE_DOUBLE_STATE = "CHANGE_DOUBLE_STATE";
export function return_change_double_state_action(name_1, state_1, name_2, state_2) {
    return {
        type: CHANGE_DOUBLE_STATE,
        name_1,
        state_1,
        name_2,
        state_2
    }
}

export const CHANGE_FOUR_STATE = "CHANGE_FOUR_STATE";
export function return_change_four_state_action(name_1, state_1, name_2, state_2, name_3, state_3,name_4,state_4) {
    return {
        type: CHANGE_FOUR_STATE,
        name_1,
        state_1,
        name_2,
        state_2,
        name_3,
        state_3,
        name_4,
        state_4
    }
}

//
//账号输入框________________________________________________________________________________________________
export function handle_account_input(value, danger, accoutInput) {
    return dispatch => {
        danger = {
            ...danger,
            isShowDanger: false,
            accoutInputRed: false
        }
        if (value.length >4&&value.length < 11) {
            accoutInput = {
                ...accoutInput,
                accoutNumber: value,
                isAccoutCorrect: true,
            }
            dispatch(return_change_double_state_action("accoutInput", accoutInput, "danger", danger))
        } else {
            accoutInput = {
                ...accoutInput,
                accoutNumber: value,
                isAccoutCorrect: false,
            }
            dispatch(return_change_double_state_action("accoutInput", accoutInput, "danger", danger))
        }
    }
}


//密码输入框________________________________________________________________________________________________
export function handle_password_input(value, passwordInput, danger) {
    return dispatch => {
        danger = {
            ...danger,
            isShowDanger: false,
            passwordRed: false
        }
        passwordInput = {
            ...passwordInput,
            passwordNumber: value,
            isPasswordCorrect: false,
        }
        dispatch(return_change_double_state_action("passwordInput", passwordInput, "danger", danger))


        //每次输入密码的时候我们都要进行密码验证
        $.get(baseUrl.get(`/user/check?type=${"password"}&value=${passwordInput.passwordNumber}`))
        .then(res => {
            if (res.result == 1) {
                passwordInput = {
                    ...passwordInput,
                    isPasswordCorrect: true,
                }
                dispatch(return_change_single_state_action("passwordInput", passwordInput))
            }else if(res.result == 0){
                danger = {
                    ...danger,
                    passwordRed: true,
                    isShowDanger: true,
                    dangerText: "要求6~16位  不得全是相同数字的密码"
                }
                dispatch(return_change_single_state_action("danger", danger))
            }
        })
    }
}


//登录点击按钮
export function handle_login_click(accoutInput,passwordInput, danger) {
    return dispatch => {
            if (accoutInput.accoutNumber.length == 0) {
                danger = {
                    ...danger,
                    accoutInputRed: true,
                    isShowDanger: true,
                    dangerText: "账号不能为空"
                }
                dispatch(return_change_single_state_action("danger", danger))

            } else if (!accoutInput.isAccoutCorrect) {
                //isAccoutCorrect检查格式是否正确
                danger = {
                    ...danger,
                    accoutInputRed: true,
                    isShowDanger: true,
                    dangerText: "账号格式错误 请输入5~11位账号"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (passwordInput.passwordNumber.length == 0) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    passwordRed: true,
                    dangerText: "请输入密码"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (!passwordInput.passwordNumber.length == 0) {


                //密码不为空的的时候  就可以发送到后台验证   验证账号密码的正确性   
                //登录的时候不用判断密码的格式 只有在设置的时候才用判断
               $.post(baseUrl.get(`/login`),{
                phone:accoutInput.accoutNumber,
                password:passwordInput.passwordNumber
               })
                    .then(res => {
                            //登录成功   直接进入个人中心
                            window.location.href = "/explore"

                    }).catch(res => {
                        console.log(res.responseJSON.code)
                        if (res.responseJSON.code == 1210) {
                            danger = {
                                ...danger,
                                accoutInputRed: true,
                                isShowDanger: true,
                                dangerText: "该手机号还没有注册"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        } else if (res.responseJSON.code == 1209) {
                            danger = {
                                ...danger,
                                passwordRed: true,
                                isShowDanger: true,
                                dangerText: "输入的密码不正确"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        }
                    })
            }
        }
}


//注册点击按钮
export function handle_register_click(accoutInput,passwordInput, danger) {
    return dispatch => {
            if (accoutInput.accoutNumber.length == 0) {
                danger = {
                    ...danger,
                    accoutInputRed: true,
                    isShowDanger: true,
                    dangerText: "账号不能为空"
                }
                dispatch(return_change_single_state_action("danger", danger))

            } else if (!accoutInput.isAccoutCorrect) {
                //isAccoutCorrect检查格式是否正确
                danger = {
                    ...danger,
                    accoutInputRed: true,
                    isShowDanger: true,
                    dangerText: "账号格式错误 请设置5~11位账号"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (passwordInput.passwordNumber.length == 0) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    passwordRed: true,
                    dangerText: "密码不能设置为空"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (!passwordInput.passwordNumber.length == 0) {


                //密码不为空的的时候  就可以发送到后台验证   验证账号密码的正确性   
                //登录的时候不用判断密码的格式 只有在设置的时候才用判断
               $.post(baseUrl.get(`/login`),{
                phone:accoutInput.accoutNumber,
                password:passwordInput.passwordNumber
               })
                    .then(res => {
                            //登录成功   直接进入个人中心
                            window.location.href = "/explore"

                    }).catch(res => {
                        console.log(res.responseJSON.code)
                        if (res.responseJSON.code == 1210) {
                            danger = {
                                ...danger,
                                accoutInputRed: true,
                                isShowDanger: true,
                                dangerText: "该手机号还没有注册"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        } else if (res.responseJSON.code == 1209) {
                            danger = {
                                ...danger,
                                passwordRed: true,
                                isShowDanger: true,
                                dangerText: "输入的密码不正确"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        }
                    })
            }
        }
}

//注册时  填写用户名密码  点击进入中心 
export function handle_login_click_1(accoutInput, nickNameInput, passwordInput, danger, history, loginOrEnter) {
    return dispatch => {
        //这是在  设置用户名密码的时候  点击进入主页的事件
        if (loginOrEnter == "进入主页") {
            if (nickNameInput.nickName.length == 0) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    nickNameInputRed: true,
                    dangerText: "昵称不能为空"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (!nickNameInput.isNameCorrect) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    nickNameInputRed: true,
                    dangerText: "昵称格式不正确"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (passwordInput.passwordNumber.length == 0) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    passwordRed: true,
                    dangerText: "密码不能设置为空"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (!passwordInput.isPasswordCorrect) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    passwordRed: true,
                    dangerText: "要求6~16位  不得全是相同数字的密码"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (passwordInput.isPasswordCorrect) {
                //只有在密码格式正确的时候  我们才能提交 昵称和密码  进行注册
                $.post(baseUrl.get(`/user/set_user`),
                {
                    new_username:nickNameInput.nickName,
                    new_password:passwordInput.passwordNumber
                }).then(res => {
                        if (res.code == 200) {
                            //完整的注册成功   直接进入个人中心
                            window.location.href = baseUrl.get("/");
                        }
                    })
            }
        } else if (loginOrEnter == "登录") {
            //这是在  用户名密码登录的时候  点击登录按钮的时候
            if (accoutInput.accoutNumber.length == 0) {
                danger = {
                    ...danger,
                    accoutInputRed: true,
                    isShowDanger: true,
                    dangerText: "手机号不能为空"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (!accoutInput.isAccoutCorrect) {
                danger = {
                    ...danger,
                    accoutInputRed: true,
                    isShowDanger: true,
                    dangerText: "手机号格式不正确"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (passwordInput.passwordNumber.length == 0) {
                danger = {
                    ...danger,
                    isShowDanger: true,
                    passwordRed: true,
                    dangerText: "请输入密码"
                }
                dispatch(return_change_single_state_action("danger", danger))
            } else if (!passwordInput.passwordNumber.length == 0) {


                //密码不为空的的时候  就可以发送到后台验证   验证账号密码的正确性   
                //登录的时候不用判断密码的格式 只有在设置的时候才用判断
               $.post(baseUrl.get(`/login`),{
                phone:accoutInput.accoutNumber,
                password:passwordInput.passwordNumber
               })
                    .then(res => {
                            //登录成功   直接进入个人中心
                            window.location.href = "/explore"

                    }).catch(res => {
                        console.log(res.responseJSON.code)
                        if (res.responseJSON.code == 1210) {
                            danger = {
                                ...danger,
                                accoutInputRed: true,
                                isShowDanger: true,
                                dangerText: "该手机号还没有注册"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        } else if (res.responseJSON.code == 1209) {
                            danger = {
                                ...danger,
                                passwordRed: true,
                                isShowDanger: true,
                                dangerText: "输入的密码不正确"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        }
                    })
            }
        }
    }
}
//点击注册按钮
export function handle_register_click_1(accoutInput, messageInput, danger, history, ButtonText) {
    return dispatch => {
        if (accoutInput.accoutNumber.length == 0) {
            danger = {
                ...danger,
                accoutInputRed: true,
                isShowDanger: true,
                dangerText: "手机号不能为空"
            }
            dispatch(return_change_single_state_action("danger", danger))

        } else if (!accoutInput.isAccoutCorrect) {
            danger = {
                ...danger,
                accoutInputRed: true,
                isShowDanger: true,
                dangerText: "手机号格式不正确"
            }
            dispatch(return_change_single_state_action("danger", danger))
        } else if (accoutInput.isPhoneExist) {
            danger = {
                ...danger,
                accoutInputRed: true,
                isShowDanger: true,
                dangerText: "该手机号已经被注册"
            }
            dispatch(return_change_single_state_action("danger", danger))
        } else if (messageInput.messageNumber.length == 0) {
            danger = {
                ...danger,
                massageInputRed: true,
                isShowDanger: true,
                dangerText: "验证码不能为空"
            }
            dispatch(return_change_single_state_action("danger", danger))
        }
        else if (!messageInput.isMessageCorrect) {
            danger = {
                ...danger,
                massageInputRed: true,
                isShowDanger: true,
                dangerText: "请输入六位验证码"
            }
            dispatch(return_change_single_state_action("danger", danger))
        } else if (messageInput.isMessageCorrect) {
            if (ButtonText == "点击注册") {
                //点击注册的时候
                $.get(baseUrl.get(`/user/phone_register?phone=${accoutInput.accoutNumber}&code=${messageInput.messageNumber}`))
                    .then(res => {
                        if (res.code == 200) {
                            history.push("/register/InfoRegister")
                        }
                    }).catch(err => {
                        console.log(err)
                        if (err.responseJSON.code == 1201) {
                            danger = {
                                ...danger,
                                massageInputRed: true,
                                isShowDanger: true,
                                dangerText: "验证码不正确"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        } else if (err.responseJSON.code == 1101) {
                            danger = {
                                ...danger,
                                massageInputRed: true,
                                isShowDanger: true,
                                dangerText: "验证码格式不正确"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        }
                    })

            } else if (ButtonText == "登录") {
                //短信登录的时候
                $.post(
                    baseUrl.get(`/phone_login`)
                ,{
                    phone:accoutInput.accoutNumber,
                    code:messageInput.messageNumber
                })
                    .then(res => {
                            //短信登录成功   直接进入个人中心
                            window.location.href = baseUrl.get("/");
                    }).catch(err => {
                        if (err.responseJSON.code == 1210) {
                            danger = {
                                ...danger,
                                accoutInputRed: true,
                                isShowDanger: true,
                                dangerText: "该手机号没有进行注册"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        } else if (err.responseJSON.code == 1201) {
                            danger = {
                                ...danger,
                                massageInputRed: true,
                                isShowDanger: true,
                                dangerText: "验证码不正确"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        }
                    })

            }


        }
    }
}

//昵称输入框________________________________________________________________________________________________
export function handle_nickName_input(value, danger, nickNameInput) {
    return dispatch => {
        danger = {
            ...danger,
            isShowDanger: false,
            nickNameInputRed: false
        }
        //目前只设置为   输入的用户名输入部位空即为正确
        if (!value.length == 0) {
            nickNameInput = {
                ...nickNameInput,
                nickName: value,
                isNameCorrect: true,
            }
            dispatch(return_change_double_state_action("nickNameInput", nickNameInput, "danger", danger))
        } else {
            nickNameInput = {
                ...nickNameInput,
                nickName: value,
                isNameCorrect: false,
            }
            dispatch(return_change_double_state_action("nickNameInput", nickNameInput, "danger", danger))
        }
    }
}





//切换登录路由的时候要进行   状态清除
export function handle_change_route(accoutInput, passwordInput, nickNameInput,danger) {
    accoutInput = {
        ...accoutInput,
        accoutNumber: ""
    }
    passwordInput = {
        ...passwordInput,
        passwordNumber: ""
    }
    nickNameInput = {
        ...nickNameInput,
        nickName: ""
    }
    danger={
        ...danger,
        accoutInputRed:false,
        nickNameInputRed:false,
        passwordInput:false
    }
    return return_change_four_state_action("accoutInput", accoutInput, "passwordInput", passwordInput,"nickNameInput", nickNameInput,"danger",danger)
}