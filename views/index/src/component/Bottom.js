import React, { Component } from 'react';
import {
  List,
  Image,
  Grid,
} from 'semantic-ui-react'
//头像引入
import logo from "../img/logo.jpg"
import flag1 from "../img/flag-1.png"
import flag2 from "../img/flag-2.gif"

class Bottom extends Component {
  render() {
    const { backColor } = this.props;
    return (
      <Grid style={{ background: backColor, textAlign: "center", padding: "14px 34px" }}>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <Image circular centered size='mini' src={logo} />
          <List horizontal inverted size='small'>
            <List.Item as='a' href='http://www.beian.miit.gov.cn/'  style={{marginRight:"3px"}}>
              Copyright © 2019
          </List.Item>
            <img style={{ width: "12px" }} src={flag1} alt="" />
            <List.Item as='a' href='http://www.beian.miit.gov.cn/' style={{marginLeft:"3px"}}>
              黑ICP备19004024号
          </List.Item>
          </List>

        </Grid.Column>
      </Grid>
    )
  }
}

export default Bottom