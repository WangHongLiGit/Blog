import React, { Component } from 'react';
import {
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    Card,
    Feed
} from 'semantic-ui-react'

//测试图片的引入
import imgPath from '../img/dns.png'


//markdown组件的引入
const ReactMarkdown = require('react-markdown')
 
const input = '# This is a header\n\nAnd this is a paragraph'

class ItemCenter extends Component {
    render() {
        return (
            <ReactMarkdown source={input} />
        )
    }
}

export default ItemCenter