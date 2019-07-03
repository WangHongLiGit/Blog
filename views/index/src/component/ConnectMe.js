import React, { Component } from 'react';
import { Button, Grid, Header, Image, Modal, Icon, Label, Radio } from 'semantic-ui-react'
import loveYou from "../img/loveYou.jpg"
import aliPay from "../img/aliPay.jpg"
import wePay from "../img/wePay.jpg"

class ThanksPay extends Component {
    state = {
        path: wePay,
        value: "wePay",
        modalOpen: false
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })
    handleChange = (e, { value }) => {
        if (value == "wePay") {
            this.setState({ value: "wePay", path: wePay })
        } else if (value == "aliPay") {
            this.setState({ value: "aliPay", path: aliPay })
        }
    } 
    render() {
        return (
            <Grid style={{ margin: "8px 0px" }}>
                <Grid.Column mobile={16} tablet={16} computer={16} textAlign="center" style={{ margin: "1rem 0m" }}>
                        <Modal
                            open={this.state.modalOpen}
                            trigger={
                                // <Button style={{ backgroundColor: "#e74c3c" }} onClick={this.handleOpen} circular>打赏</Button>
                                <Header as='h4'>
                                    <Icon.Group size='large'
                                        onClick={this.handleOpen}
                                    >
                                        <Icon loading size='large' name='circle notch' />
                                        <Icon name='qq' />
                                    </Icon.Group>
                                    <Icon.Group size='large'
                                        onClick={this.handleOpen}
                                    >
                                        <Icon loading size='large' name='circle notch' />
                                        <Icon name='wechat' />
                                    </Icon.Group>
                                    <Icon.Group size='large'
                                        onClick={this.handleOpen}
                                    >
                                        <Icon loading size='large' name='circle notch' />
                                        <Icon name='mail' />
                                    </Icon.Group>
                                    @联系作者
                                </Header>
                            }
                        >

                            <Modal.Header>
                                感谢您的支持
                                <Button size="tiny" circular onClick={this.handleClose} icon='x' floated="right" />
                            </Modal.Header>
                            <Modal.Content image>
                                <Image wrapped size='medium' src={this.state.path} />
                                <Modal.Description>
                                    <Header>您可以随意赞赏</Header>
                                    <Radio
                                        label='微信'
                                        name='wePay'
                                        value='wePay'
                                        checked={this.state.value === 'wePay'}
                                        onChange={this.handleChange}
                                    />
                                    <Radio
                                        style={{ marginLeft: "5px" }}
                                        label='支付宝'
                                        name='aliPay'
                                        value='aliPay'
                                        checked={this.state.value === 'aliPay'}
                                        onChange={this.handleChange}
                                    />
                                </Modal.Description>
                            </Modal.Content>
                        </Modal>
                </Grid.Column>
            </Grid>
        )
    }
}
export default ThanksPay