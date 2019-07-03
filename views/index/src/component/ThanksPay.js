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
                    <div style={{ width: "40%", display: "inline-block", float: "left" }}>
                        <Image src={loveYou} size="tiny" style={{ margin: "0px auto 12px auto " }}></Image>

                        <Modal
                            open={this.state.modalOpen}
                            trigger={<Button style={{ backgroundColor: "#e74c3c" }} onClick={this.handleOpen} circular>打赏</Button>}
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
                    </div>
                    <div style={{ width: "60%", display: "inline-block", height: "100%", float: "left" }}>
                        <Label style={{ height: "137px", width: "100%", fontSize: "1rem", padding: "2rem 0em" }}>
                            <p>如果您感觉文章还不错~~</p>
                            <p>可以随意赞赏~~</p>
                            <p><Icon size="large" name="hand point left"></Icon>点击支持一下哦~~</p>
                        </Label>
                    </div>
                </Grid.Column>
            </Grid>
        )
    }
}
export default ThanksPay