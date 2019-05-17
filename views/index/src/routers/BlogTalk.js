import React from 'react'
import { Button, Comment, Form, Header, Icon,Container} from 'semantic-ui-react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


//回到顶部
const returnUp = function () {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth"
    })
}
const BlogTalk = () => (
    <Container style={{marginTop:"22px"}}>
        <Comment.Group threaded>
            <Header as='h3' style={{ fontSize: "1.5rem" }}>
                <Icon name="comments outline"></Icon>
                Blog留言
    
    </Header>

            <Form reply>
                <Form.TextArea style={{ height: "9em" }} />
                <Button content='Add Reply' labelPosition='left' icon='edit' primary />
            </Form>

            <Header as='h3' style={{ fontSize: "1.4rem" }} dividing>
                全部留言
    </Header>
            <Comment>
                <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                <Comment.Content>
                    <Comment.Author as='a'>Matt</Comment.Author>
                    <Comment.Text>How artistic!</Comment.Text>
                    <Comment.Actions>
                        <Link to="/BlogReply" onClick={returnUp}>
                            回复
            </Link>
                    </Comment.Actions>
                </Comment.Content>
            </Comment>
            <Comment>
                <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                <Comment.Content>
                    <Comment.Author as='a'>Elliot Fu</Comment.Author>
                    <Comment.Text>
                        <p>This has been very useful for my research. Thanks as well!</p>
                    </Comment.Text>
                    <Comment.Actions>
                        <Link to="/BlogReply" onClick={returnUp}>
                            回复
            </Link>
                    </Comment.Actions>
                </Comment.Content>

                <Comment.Group>
                    <Comment>
                        <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Jenny Hess</Comment.Author>
                            <Comment.Text>Elliot you are always so right :)</Comment.Text>
                            <Comment.Actions>
                                <Link to="/BlogReply" onClick={returnUp}>
                                    回复
            </Link>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </Comment>

            <Comment>
                <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                <Comment.Content>
                    <Comment.Author as='a'>Joe Henderson</Comment.Author>
                    <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
                    <Comment.Actions>
                        <Link to="/BlogReply" onClick={returnUp}>
                            回复
            </Link>
                    </Comment.Actions>
                </Comment.Content>
            </Comment>

        </Comment.Group>
    </Container>

)

export default BlogTalk