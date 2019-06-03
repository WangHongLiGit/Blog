import React, { Component } from 'react';
import {
    Button,
    Container,
    Header,
    Icon,
    Transition,
} from 'semantic-ui-react'

import PropTypes from 'prop-types'
import {  Link } from 'react-router-dom';
import {handle_push_history,handle_change_up} from "../actions"
import { connect } from 'react-redux';


class HomepageHeading extends Component {
    handleHeaderClick(){
        this.props.handlePushHistory(this.props.historyArr,"/AllBlogCenter")
        this.props.handleChangeUp(true)
    }
    render() {
        const { mobile, IsSlideUp } = this.props
        return (
            <div>
                <Transition visible={!IsSlideUp} animation='scale' duration={400}>
                    <Container text>
                        <Header
                            as='h1'
                            content='HongLi-Blog'
                            inverted
                            style={{
                                fontSize: mobile ? '2em' : '4em',
                                fontWeight: 'normal',
                                marginBottom: 0,
                                marginTop: mobile ? '0.8em' : '3em',
                            }}
                        />
                        <Header
                            as='h2'
                            content='一个专注于前端的小白@'
                            inverted
                            style={{
                                fontSize: mobile ? '1.5em' : '1.7em',
                                fontWeight: 'normal',
                                marginTop: mobile ? '0.5em' : '1.5em',
                            }}
                        />
                        <Link to="/AllBlogCenter">
                            <Button primary size='large' onClick={()=>{this.handleHeaderClick()}}>
                                所有博客
                                <Icon name='right arrow' />
                            </Button>
                        </Link>
                    </Container>
                </Transition>
            </div>
        )
    }
}
HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
}

export default connect(
    state => {
        return {
            IsSlideUp:state.IsSlideUp,
            historyArr:state.historyArr
        }
    },
    dispatch => ({
        handleChangeUp: function (IsSlideUp) {
            dispatch(handle_change_up(IsSlideUp))
          },
        handlePushHistory: function (historyArr,newRoute) {
            dispatch(handle_push_history(historyArr,newRoute))
        },
    })
)(HomepageHeading)