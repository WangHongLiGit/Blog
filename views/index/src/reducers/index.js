import {
    CHANGE_SINGLE_STATE,
    CHANGE_DOUBLE_STATE,
    CHANGE_FOUR_STATE
} from "../actions"


export default function reducer(
    state = {
        //账号输入框
        accoutInput: {
            accoutNumber: "",
            isAccoutExist: false,
            isAccoutCorrect: false,
        },
        //密码输入框
        passwordInput: {
            passwordNumber: "",
            isPasswordCorrect: false,
        },
        //昵称输入框
        nicknameInput: {
            nickname: "",
            isNicknameCorrect: false,
        },
        //警告状态
        danger: {
            passwordInputRed: false,
            nicknameInputRed: false,
            accoutInputRed: false,
            isShowDanger: false,
            dangerText: ""
        },
    }, action) {
        switch (action.type) {
        
            case CHANGE_SINGLE_STATE:
            return {
                ...state,
                [action.stateName]:action.newState
            }
            case CHANGE_DOUBLE_STATE:
            return {
                ...state,
                [action.name_1]:action.state_1,
                [action.name_2]:action.state_2
            }
            case CHANGE_FOUR_STATE:
            return {
                ...state,
                [action.name_1]:action.state_1,
                [action.name_2]:action.state_2,
                [action.name_3]:action.state_3,
                [action.name_4]:action.state_4
            }
            default:
                return state
        }

}