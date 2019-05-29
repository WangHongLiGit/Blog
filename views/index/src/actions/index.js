import $ from "jquery";

//设置定时器
let timer;
var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return 'http://127.0.0.1:4000' + path
}

export const CHANGE_CHANGE_UP = "CHANGE_CHANGE_UP";
export function handle_change_up(IsSlideUp) {
    return {
        type: "CHANGE_CHANGE_UP",
        newValue: IsSlideUp
    }
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
export function return_change_four_state_action(name_1, state_1, name_2, state_2, name_3, state_3, name_4, state_4) {
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
            accoutInputRed: false,
            passwordInputRed: false,
            nameInputRed: false
        }
        if (value.length > 4 && value.length < 11) {
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
export function handle_password_input(value, danger, passwordInput) {
    return dispatch => {
        passwordInput = {
            ...passwordInput,
            passwordNumber: value,
        }
        danger = {
            ...danger,
            accoutInputRed: false,
            passwordInputRed: false,
            nicknameInputRed: false
        }
        dispatch(return_change_double_state_action("passwordInput", passwordInput, "danger", danger))
    }
}

//密码输入框________________________________________________________________________________________________
export function handle_nickname_input(value, danger, nicknameInput) {
    return dispatch => {
        nicknameInput = {
            ...nicknameInput,
            nickname: value,
        }
        danger = {
            ...danger,
            accoutInputRed: false,
            passwordInputRed: false,
            nicknameInputRed: false
        }
        dispatch(return_change_double_state_action("nicknameInput", nicknameInput, "danger", danger))
    }
}


//登录点击按钮
export function handle_login_click(accoutInput, passwordInput, danger, history, historyArr, messageShow) {
    return dispatch => {
        if (accoutInput.accoutNumber.length == 0) {
            danger = {
                ...danger,
                accoutInputRed: true,
                dangerText: "请输入账号"
            }
            dispatch(return_change_single_state_action("danger", danger))

        } else if (!accoutInput.isAccoutCorrect) {
            //isAccoutCorrect检查格式是否正确
            danger = {
                ...danger,
                accoutInputRed: true,
                dangerText: "账号格式错误 请输入5~11位账号"
            }
            dispatch(return_change_single_state_action("danger", danger))
        } else if (passwordInput.passwordNumber.length == 0) {
            danger = {
                ...danger,
                passwordInputRed: true,
                dangerText: "请输入密码"
            }
            dispatch(return_change_single_state_action("danger", danger))
        } else if (!passwordInput.passwordNumber.length == 0) {
            //密码不为空的的时候  就可以发送到后台验证   验证账号密码的正确性   
            //登录的时候不用判断密码的格式 只有在设置的时候才用判断

            $.ajax({
                type: "post",
                url: baseUrl.get(`/login`),
                xhrFields: { withCredentials: true },
                dataType: "json",
                data: {
                    account: accoutInput.accoutNumber,
                    password: passwordInput.passwordNumber
                },
                success: function (data) {
                    history.push(historyArr[0])
                    messageShow = {
                        ...messageShow,
                        open: true,
                        message: "登录成功"
                    }
                    dispatch(return_change_single_state_action("messageShow", messageShow))
                    window.setTimeout(function () {
                        messageShow = {
                            ...messageShow,
                            open: false,
                            message: ""
                        }
                        dispatch(return_change_single_state_action("messageShow", messageShow))
                    }, 1000)
                },
                error: function (data) {
                    if (data.responseJSON.code == 1002) {
                        danger = {
                            ...danger,
                            accoutInputRed: true,
                            dangerText: "该账号号还没有注册"
                        }
                        dispatch(return_change_single_state_action("danger", danger))
                    } else if (data.responseJSON.code == 1001) {
                        danger = {
                            ...danger,
                            passwordInputRed: true,
                            dangerText: "输入的密码不正确"
                        }
                        dispatch(return_change_single_state_action("danger", danger))
                    }
                }
            })
        }
    }
}


//注册点击按钮
export function handle_register_click(accoutInput, passwordInput, nicknameInput, danger, history,messageShow) {
    return dispatch => {
        if (accoutInput.accoutNumber.length == 0) {
            danger = {
                ...danger,
                accoutInputRed: true,
                dangerText: "账号不能设置为空"
            }
            dispatch(return_change_single_state_action("danger", danger))

        } else if (!accoutInput.isAccoutCorrect) {
            //isAccoutCorrect检查格式是否正确
            danger = {
                ...danger,
                accoutInputRed: true,
                dangerText: "账号格式错误 请设置5~16位账号"
            }
            dispatch(return_change_single_state_action("danger", danger))
        } else if (accoutInput.isAccoutCorrect) {
            $.ajax({
                type: "post",
                url: baseUrl.get(`/isRegistered`),
                xhrFields: { withCredentials: true },
                dataType: "json",
                data: {
                    account: accoutInput.accoutNumber,
                },
                success: function (data) {

                    //成功代表没有注册
                    if (passwordInput.passwordNumber.length == 0) {
                        danger = {
                            ...danger,
                            passwordInputRed: true,
                            dangerText: "密码不能设置为空"
                        }
                        dispatch(return_change_single_state_action("danger", danger))
                    } else if (nicknameInput.nickname.length == 0) {
                        //isAccoutCorrect检查格式是否正确
                        danger = {
                            ...danger,
                            nicknameInputRed: true,
                            dangerText: "设置昵称呗~~"
                        }
                        dispatch(return_change_single_state_action("danger", danger))
                    } else if (!nicknameInput.nickname.length == 0) {
                        var reg = /^[a-zA-Z0-9]{5,11}$/;
                        if (reg.test(passwordInput.passwordNumber)) {
                            $.ajax({
                                type: "post",
                                url: baseUrl.get(`/register`),
                                xhrFields: { withCredentials: true },
                                dataType: "json",
                                data: {
                                    account: accoutInput.accoutNumber,
                                    password: passwordInput.passwordNumber,
                                    nickname: nicknameInput.nickname
                                },
                                success: function (data) {
                                    history.replace("/Login")
                                    messageShow = {
                                        ...messageShow,
                                        open: true,
                                        message: "注册成功 请登录~"
                                    }
                                    dispatch(return_change_single_state_action("messageShow", messageShow))
                                    window.setTimeout(function () {
                                        messageShow = {
                                            ...messageShow,
                                            open: false,
                                            message: ""
                                        }
                                        dispatch(return_change_single_state_action("messageShow", messageShow))
                                    }, 1000)
                                },
                                error: function (data) {
                                    console.log("error", data)
                                }
                            })
                        } else {
                            danger = {
                                ...danger,
                                passwordInputRed: true,
                                dangerText: "请设置5-15位密码 不能包含特殊字符"
                            }
                            dispatch(return_change_single_state_action("danger", danger))
                        }
                    }
                },
                error: function (data) {
                    if (data.responseJSON.code == 1003) {
                        danger = {
                            ...danger,
                            accoutInputRed: true,
                            dangerText: "该账号已经注册"
                        }
                        dispatch(return_change_single_state_action("danger", danger))
                    }
                }
            })
        }
    }
}





//切换登录路由的时候要进行   状态清除
export function handle_change_route(accoutInput, passwordInput, nickNameInput, danger) {
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
    danger = {
        ...danger,
        accoutInputRed: false,
        nicknameInputRed: false,
        passwordInputRed: false
    }
    return return_change_four_state_action("accoutInput", accoutInput, "passwordInput", passwordInput, "nickNameInput", nickNameInput, "danger", danger)
}


//添加到history中去
export function handle_push_history(historyArr, newRoute) {
    historyArr.push(newRoute)
    return return_change_single_state_action("historyArr", historyArr)
}



//提示信息
export function handle_message_show(messageShow, message) {
    messageShow = {
        ...messageShow,
        open: true,
        message: message
    }
    return return_change_single_state_action("messageShow", messageShow)
}


