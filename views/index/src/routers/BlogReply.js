import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment,Icon } from 'semantic-ui-react'
import ContactAndAdvertisment from '../component/ContactAndAdvertisment'


const Login = () => (
    <div className='login-form'>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}
        </style>
        <Grid  style={{ height: '100%', margin: "34px 0px" }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={7} computer={7}>
                <Header  style={{ fontSize: "1.5rem"}}>
                    <Icon name="comments outline" style={{display:"inline-block"}}></Icon>
                    留言给 <span>hongli</span>
                </Header>

                <Form reply>
                    <Form.TextArea style={{ height: "9em" }} />
                    <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                </Form>

            </Grid.Column>
            <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={1} computer={1} style={{ padding: "0px" }}>
            </Grid.Column>
            <Grid.Column style={{ maxWidth: 450 }} mobile={16} tablet={8} computer={8}>
                <ContactAndAdvertisment></ContactAndAdvertisment>

            </Grid.Column>
        </Grid>

    </div>
)

export default Login