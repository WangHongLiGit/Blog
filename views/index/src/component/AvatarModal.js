import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Slider from '@material-ui/lab/Slider';
import AvatarEditor from 'react-avatar-editor'
import $ from "jquery"


var baseUrl = {}
// http://127.0.0.1:4000
baseUrl.get = function (path) {
    return "" + path
}



const styles = {
    card: {
        height: 529,
    },
    button_img_card: {
        height: 160,
        width: 160,
    },
    button_img_media: {
        height: 160,
        width: 160
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    root: {
        height:100
    },
};


//全局  所选择的图片
let selectImg;

//呼出的对话框组件
const emails = ['username@gmail.com', 'user02@gmail.com'];
class SimpleDialog extends React.Component {

    //头像的属性
    constructor(props, context) {
        super(props, context);
        this.state = {
            scale: 1.2,
            value: 50,
        }
    }

    setEditorRef = (editor) => this.editor = editor

    //控制avatar的缩放
    handleChange = (event, value) => {
        this.setState({
            value,
            scale: 0.7 + (value * 0.01),
        });
    };

    //传过来的关闭模态框方法
    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    //上传文件的方法
    upload(file) {
        var formdata = new FormData()
        formdata.append("avator_file", file)
        $.ajax({
            type: "post",
            url: baseUrl.get(`/upload_avator`),
            dataType: "json",
            contentType: false,
            processData: false,
            data: formdata,
            xhrFields: { withCredentials: true },
            success: (data) => {
                    this.props.changeUserAvator(data.avatarPath)
                    this.handleClose()
            }
        })
    }
    onClickSave = () => {
        //点击保存的时候的时候
        //将图片文件发送ajax请求到后台 
        //关闭模态框
        if (this.editor) {
            const canvas = this.editor.getImage().toDataURL()
            fetch(canvas)
                .then(res => res.blob())
                .then(blob => {
                    this.upload(blob)
                })
        }
    }
    render() {
        const { UploadImage, classes, onClose, selectedValue, ...other } = this.props;
        const { value, width, height, border, color, scale } = this.state
        return (
            <Dialog aria-labelledby="simple-dialog-title" {...other} style={{margin : '-48px'}}>
                    <Card className={classes.card}  style={{ display:"flex",flexDirection:"column",alignItems:"center",}} >
                        <Button className={classes.button} onClick={this.handleClose}>
                            返回
                        </Button>
                        <Typography tex gutterBottom variant="h5" component="h2" style={{ marginTop: "36px"}}>
                            编辑头像
                        </Typography>
                        <Typography style={{ marginTop: "6px"}}>
                            调节头像尺寸和位置
                        </Typography>
                        <CardActionArea  style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                {/* 头像编辑器组件 */}
                                <AvatarEditor
                                    ref={this.setEditorRef}
                                    image={selectImg}
                                    width={width}
                                    height={height}
                                    border={border}
                                    color={color} // RGBA
                                    scale={scale}
                                />
                        </CardActionArea>
                        <CardActions style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                <Typography style={{ marginTop: "20px" }}>
                                    调节头像尺寸和位置
                                </Typography>
                                <Slider
                                    style={{width:"300px",margin:"10px"}}
                                    classes={{ container: classes.slider }}
                                    value={value}
                                    aria-labelledby="label"
                                    onChange={this.handleChange}
                                />
                        </CardActions>
                        <div>

                        <Button style={{width:"120px",marginTop:"20px"}}  variant="outlined" color="primary" onClick={() => { this.onClickSave() }} className={classes.button}>
                                保存
                        </Button>
                        </div>
                    </Card>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);



//控制模态框呼出部分
class SimpleDialogDemo extends React.Component {
    state = {
        userAvatarPath: null,
        //模态框开启状态
        open: false,
        //模态框自带状态  不用管他  
        selectedValue: emails[1],
    };


    // 然后调用呼出模态框 设置open状态为true
    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };
    // 关闭呼出的模态框 
    handleClose = value => {
        this.setState({ selectedValue: value, open: false });
    };




    //这个方法是更改用户图像路径  从而更改用户头像
    changeUserAvator(path) {
        this.setState({ userAvatarPath: path });
    }

    //向后台获取用户头像的userAvatarPath 并设置到头像中去
    componentWillMount() {
        $.ajax({
            type: "get",
            url: baseUrl.get(`/getAvatarPath`),
            xhrFields: { withCredentials: true },
            dataType: "json",
            success: (data) => {
                this.setState({userAvatarPath:data.userAvatarPath})
            },
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div>


                    <input type="file"
                        accept='image/*'
                        style={{ visibility: "hidden", width: "0px" }}
                        ref={node => { this.fileInput = node }}
                        onChange={(e) => {
                            //将选好的图片设置到全局变量中去 
                            selectImg = e.target.files[0]
                            // 然后调用呼出模态框 设置open状态为true
                            this.handleClickOpen()
                            //注意：再次选择同一个图片的时候  fileInout时检测不到的  也就是说不会触发 onChange事件
                            //我们需要手动清除input标签的value  保证再次选择同一图片的时候会触发 onchange事件                   
                            this.fileInput.value = "";
                        }}
                    />





   

                    {/*展示头像卡片*/}
                    <Card className={classes.button_img_card} style={{ borderRadius: "50%", margin: "0px auto" }}>
                        <CardActionArea>
                            <CardMedia
                                style={{ borderRadius: "50" }}
                                className={classes.button_img_media}

                                //这个路径是状态中的路径
                                image={this.state.userAvatarPath}
                                title="Contemplative Reptile"

                                //点击头像  唤出模态框
                                onClick={() => { this.fileInput.click() }}
                            />
                        </CardActionArea>
                    </Card>
                </div>


                {/* 这个是呼出的模态框  需要传递一些参数参数过去*/}
                <SimpleDialogWrapped
                    changeUserAvator={(path) => { this.changeUserAvator(path) }}
                    selectedValue={this.state.selectedValue}
                    open={this.state.open}
                    onClose={this.handleClose}
                />
            </div>
        );
    }
}

export default withStyles(styles)(SimpleDialogDemo)

