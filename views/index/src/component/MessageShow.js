import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';

import { handle_account_input, handle_password_input, handle_login_click,handle_change_route} from "../actions"


class MessageShow extends React.Component {
  state = {
    open: false,
    Transition:function TransitionRight(props) {
      return <Slide {...props} direction="right" />;
    }
  };



  render() {
    let {messageShow}=this.props;
    let {open,message}=messageShow;

    return (
      <div>
        <Snackbar
          style={{width:"70%",margin:"0px auto"}}
          open={open}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
        />
      </div>
    );
  }
}

export default connect(
  state => {
      return {
          nicknameInput:state.nicknameInput,
          accoutInput: state.accoutInput,
          passwordInput: state.passwordInput,
          danger: state.danger,
          historyArr:state.historyArr,
          messageShow:state.messageShow,
      }
  },
  dispatch => ({
      handleAccountInput: function (value, danger, accoutInput) {
          dispatch(handle_account_input(value, danger, accoutInput))
      },
      handlePasswordInput: function (value, danger, passwordInput) {
          dispatch(handle_password_input(value, danger, passwordInput))
      },
      handleLoginClick: function (accoutInput,passwordInput, danger,history,historyArr) {
          dispatch(handle_login_click(accoutInput,passwordInput, danger,history,historyArr))
      },
      handleChangeRoute: function (accoutInput, passwordInput, nicknameInput,danger) {
          dispatch(handle_change_route(accoutInput, passwordInput, nicknameInput,danger))
      },
  })
)(MessageShow)