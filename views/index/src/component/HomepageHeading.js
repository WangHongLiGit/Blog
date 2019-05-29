import React, { Component } from 'react';
import {
    Button,
    Container,
    Header,
    Icon,
    Transition,
} from 'semantic-ui-react'

import PropTypes from 'prop-types'


class HomepageHeading extends Component {
    render() {
        const { mobile,IsSlideUp} = this.props
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
                                marginTop: mobile ? '1em' : '3em',
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
                        <Button primary size='huge'>
                            进入主页
                          <Icon name='right arrow' />
                        </Button>
                    </Container>
                </Transition>
            </div>
        )
    }
}
HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
}

export default HomepageHeading