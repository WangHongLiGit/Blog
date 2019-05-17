import React, { Component } from 'react';
import {
    Image,
    Card,
} from 'semantic-ui-react'

//3.右侧广告位
const ContactAndAdvertisment = () => (
    <Card fluid>
        <Card.Content>
            <Card.Header textAlign="left">广告位</Card.Header>
        </Card.Content>
        <Card.Content >
            <Image
                fluid
                src='https://react.semantic-ui.com/images/wireframe/image-text.png'
                as='a'
                href='http://google.com'
                target='_blank'
            />
        </Card.Content>
    </Card>
)
export default ContactAndAdvertisment