import React, { Component } from 'react';
import { Button, Grid, Header, Image, Modal, Icon} from 'semantic-ui-react'
import QQContact from "../img/QQContact.JPG"
import weContact from "../img/weContact.JPG"

class ThanksPay extends Component {
    state = {
        path: "",
        modalOpen: false
    }

    handleOpen = (value) => {
        if (value === "QQContact") {
            this.setState({ path: QQContact, modalOpen: true})
        } else if (value === "weContact") {
            this.setState({ path: weContact, modalOpen: true})
        }
    }
    handleClose = () => this.setState({ modalOpen: false })
    render() {
        return (
            <Grid style={{ margin: "8px 0px" }}>
                <Grid.Column mobile={16} tablet={16} computer={16} textAlign="center" style={{ margin: "1rem 0m" }}>
                        <Modal
                            open={this.state.modalOpen}
                            style={{maxWidth:"342px"}}
                            trigger={
                                // <Button style={{ backgroundColor: "#e74c3c" }} onClick={this.handleOpen} circular>打赏</Button>
                                <Header as='h4' style={{textAlign:"left"}}>
                                    <Icon.Group size='large'
                                        onClick={()=>{this.handleOpen("QQContact")}}
                                    >
                                        <Icon loading size='large' name='circle notch' />
                                        <Icon name='qq' />
                                    </Icon.Group>
                                    <Icon.Group size='large'
                                        onClick={()=>{this.handleOpen("weContact")}}
                                        >
                                        <Icon loading size='large' name='circle notch' />
                                        <Icon name='wechat' />
                                    </Icon.Group>
                                    @联系作者
                                </Header>
                            }
                        >
                            <Modal.Header>
                                欢迎联系博主~
                                <Button size="tiny" circular onClick={this.handleClose} icon='x' floated="right" />
                            </Modal.Header>
                            <Modal.Content image>
                                <Image wrapped size='medium' src={this.state.path} />
                            </Modal.Content>
                        </Modal>
                </Grid.Column>
            </Grid>
        )
    }
}
export default ThanksPay