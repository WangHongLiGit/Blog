import React, { Component } from 'react';
import {
  Container,
  List,
  Segment,
  Divider,
  Image
} from 'semantic-ui-react'
//头像引入
import logo from "../img/logo.jpg"
class Bottom extends Component {
  render() {
    return (
      <Segment inverted vertical style={{ margin: '0em 0em 0em', padding: '0.5em 0em' }}>
      <Container textAlign='center'>
        <Divider inverted section/>
        <Image circular centered size='mini' src={logo} />
        <List horizontal inverted divided link size='small'>
          <List.Item as='a' href='#'>
            Site Map
          </List.Item>
          <List.Item as='a' href='#'>
            Contact Us
          </List.Item>
          <List.Item as='a' href='#'>
            Terms and Conditions
          </List.Item>
          <List.Item as='a' href='#'>
            Privacy Policy
          </List.Item>
        </List>
      </Container>
    </Segment>
    )
  }
}

export default Bottom