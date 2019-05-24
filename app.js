var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log("master start...");

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('listening', function (worker, address) {
        console.log('listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    var express = require("express");
    var app = express();
    app.listen(4000)
    app.use(function (req, res, next) {
        console.log(req.url)
        next()
    }
    )

    app.use("/Blog", express.static('./blogItems'))
    app.use("/Avatar", express.static('./avatars'))


    //mongoDB
    var mongodb = require("mongodb");
    var { MongoClient, ObjectId } = mongodb



    //cookieParser
    var cookieParser = require("cookie-parser");
    app.use(cookieParser())

    app.use(function (req, res, next) {
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }).then(client => {
            var sessionData = client.db('Blog').collection('sessionData')
            sessionData.findOne({ "token": req.cookies.token }, function (err, result) {
                if (result) {
                    req.user_id = result.user_id
                } else {
                    req.user_id = ""
                }
                client.close()
                next()
            })
        })
    })

    //
    var fs = require("fs")

    //session中间件的引入
    // var initSessionMiddleWare = require("./tools/session")
    // app.use(initSessionMiddleWare.initSessionData())

    //localHost和127.0.0.1属于不同域名是
    //Access to XMLHttpRequest at 'http://127.0.0.1:4000/login'
    // from origin 'http://localhost:3000' has been blocked by CORS policy: 
    //The 'Access-Control-Allow-Origin' header has a value 'http://127.0.0.1:3000' that is not equal to the supplied origin.

    //跨域问题
    app.use((req, res, next) => {
        console.log('处理的线程 - ', process.pid, ' 请求 - ', req.method, ' ', req.url)
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
        res.setHeader('Access-Control-Allow-Headers', 'content-type,x-requested-with')
        res.setHeader("Access-Control-Allow-Credentials", "true")
        next()

    })

    var uuid = require('uuid')


    app.post("/login", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        let { account, password } = req.body;
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            if (connectError) {
                res.status(500).send({ code: 500, msg: "服务器链接错误" })
                return
            }
            client.db('Blog').collection('users').findOne({ account, password }, function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器查询错误" })
                    return
                }
                if (result) {
                    // 登录成功是讲数据存储到session_data中
                    var token = uuid()
                    var expire = Date.now()
                    // 登录成功后向前台发送token并且将其记录在数据库中 session表中
                    var sessionData = client.db('Blog').collection('sessionData')
                    sessionData.updateOne(
                        {
                            user_id: result._id
                        },
                        {
                            $set: {
                                token: token,
                                expire: expire,
                                user_id: result._id
                            }
                        },
                        {
                            upsert: true
                        }
                    ).then(result => {
                        console.log(token)
                        res.cookie('token', token)
                        res.send({ code: 200, msg: "登陆成功" })
                        client.close()
                    })
                } else {
                    //没查到的话  再单独查一下account 就有两种自定义错误
                    client.db('Blog').collection('users').findOne({ 'account': account }).then(result => {
                        if (result) {
                            res.status(400).send({ code: 1001, msg: "密码错误" })
                        } else {
                            res.status(400).send({ code: 1002, msg: "该用户还没有没有注册" })
                        }
                        client.close()
                    }).catch(err => {
                        res.status(500).send({ code: 500, msg: "数据库查询错误" })
                    })

                }
            })
        }
        )
    })
    app.post("/isRegistered", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        let { account } = req.body;
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            if (connectError) {
                res.status(500).send({ code: 500, msg: "服务器链接错误" })
                return
            }
            client.db('Blog').collection('users').findOne({ account }, function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器查询错误" })
                    return
                }
                if (result) {
                    //查到了该账号
                    res.status(400).send({ code: 1003, msg: "该账号已经注册" })
                } else {
                    res.status(200).send({ code: 200, msg: "该用户没有注册  可以继续注册" })
                }
            })
        }
        )
    })
    app.post("/register", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        let { account, password } = req.body;
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            if (connectError) {
                res.status(500).send({ code: 500, msg: "服务器链接错误" })
                return
            }
            client.db('Blog').collection('users').insert({ account, password }, function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器插入错误" })
                    return
                }
                res.status(200).send({ code: 200, msg: "注册成功" })
            })
        }
        )
    })
    app.get("/blogItems/:direcionNum", function (req, res) {
        console.log("后端路由也可以过锅炉参数", req.params.direcionNum)
        let blogPath = `.${req.url}/1.md`
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {

            var BlogCenter = client.db('Blog').collection('BlogCenter')
            BlogCenter.findOne({ direcionNum: req.params.direcionNum }, function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器查询错误" })
                    return
                }
                if (result) {
                    fs.readFile(blogPath, function (err, data) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        res.status(200).send(
                            JSON.stringify(
                                {
                                    data: data.toString(),
                                    commentData: result.commentData,
                                    replyOneData: result.replyOneData,
                                    replyTwoData: result.replyTwoData
                                }
                            )
                        )
                    })
                }
            })
        })
        console.log("读取路径", blogPath)

    })
    app.get("/allBlogCenter", function (req, res) {
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            if (connectError) {
                res.status(500).send({ code: 500, msg: "服务器链接错误" })
                return
            }
            client.db('Blog').collection('BlogCenter').find({}).toArray(function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器查询错误" })
                    return
                }
                if (result) {
                    res.status(200).send(JSON.stringify(result))
                } else {
                    res.status(500).send({ code: 500, msg: "服务器啥都没查到" })
                }
            })
        })
    })
    //提交评论按钮 
    app.post("/submitComment", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        if (req.user_id.length == 0) {
            console.log("需要重定向")
        } else {
            let { content, direcionNum } = req.body;
            let user_id = req.user_id;
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                client.db('Blog').collection('users').findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        let uniqueNum = uuid()

                        let commentData = {
                            uniqueNum: uniqueNum,
                            avatarPath: result.avatarPath,
                            nickname: result.nickname,
                            content: content
                        }
                        var BlogCenter = client.db('Blog').collection('BlogCenter')
                        BlogCenter.findOne({ direcionNum: direcionNum }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                let commentDataArr = result_1.commentData;
                                commentDataArr.push(commentData)
                                BlogCenter.updateOne(
                                    {
                                        direcionNum: direcionNum
                                    },
                                    {
                                        $set: {
                                            commentData: commentDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result => {
                                    res.status(200).send(JSON.stringify({ commentData: commentDataArr }))
                                    client.close()
                                })
                            }
                        })
                    }
                })
            }
            )
        }

    })
    //点击第一层回复按钮
    app.post("/replyOne", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        if (req.user_id.length == 0) {
            console.log("需要重定向")
        } else {
            let { content, recieverNum, direcionNum, recieverNickname } = req.body;
            let user_id = req.user_id;

            //查询用户的avatarPath就行  
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                client.db('Blog').collection('users').findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        let uniqueNum = uuid()
                        let replyOneData = {
                            senderId: result._id,
                            senderAvatarPath: result.avatarPath,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            uniqueNum: uniqueNum,
                            content: content,
                            recieverNickname: recieverNickname
                        }
                        var BlogCenter = client.db('Blog').collection('BlogCenter')
                        BlogCenter.findOne({ direcionNum: direcionNum }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                let replyOneDataArr = result_1.replyOneData;
                                replyOneDataArr.push(replyOneData)
                                BlogCenter.updateOne(
                                    {
                                        direcionNum: direcionNum
                                    },
                                    {
                                        $set: {
                                            replyOneData: replyOneDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result => {
                                    res.status(200).send(JSON.stringify({ replyOneData: replyOneDataArr }))
                                    client.close()
                                })
                            }
                        })
                    }
                })
            }
            )
        }

    })
    //点击第一层回复按钮
    app.post("/replyTwo", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        if (req.user_id.length == 0) {
            console.log("需要重定向")
        } else {
            let { content, recieverNum, direcionNum, upNum, recieverNickname } = req.body;
            let user_id = req.user_id;

            //查询用户的avatarPath就行  
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                client.db('Blog').collection('users').findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        let replyTwoData = {
                            senderId: result._id,
                            senderAvatarPath: result.avatarPath,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            upNum: upNum,
                            recieverNickname: recieverNickname,
                            content: content
                        }
                        var BlogCenter = client.db('Blog').collection('BlogCenter')
                        BlogCenter.findOne({ direcionNum: direcionNum }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                let replyTwoDataArr = result_1.replyTwoData;
                                replyTwoDataArr.push(replyTwoData)
                                BlogCenter.updateOne(
                                    {
                                        direcionNum: direcionNum
                                    },
                                    {
                                        $set: {
                                            replyTwoData: replyTwoDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result => {
                                    res.status(200).send(JSON.stringify({ replyTwoData: replyTwoDataArr }))
                                    client.close()
                                })
                            }
                        })
                    }
                })
            }
            )
        }

    })

    //留言区接口
    app.get("/talkCenter", function (req, res) {
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            var talkCenter = client.db('Blog').collection('talkCenter')
            talkCenter.findOne({ colectionName: "talkCenter" }, function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器查询错误" })
                    return
                }
                if (result) {
                    res.status(200).send(
                        JSON.stringify(
                            {
                                commentData: result.commentData,
                                replyOneData: result.replyOneData,
                                replyTwoData: result.replyTwoData
                            }
                        )
                    )
                }
            })
        })
    })
    //留言提交接口
    app.post("/submitTalkComment", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        if (req.user_id.length == 0) {
            console.log("需要重定向")
        } else {
            let { content } = req.body;
            let user_id = req.user_id;
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                client.db('Blog').collection('users').findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        let uniqueNum = uuid()

                        let commentData = {
                            uniqueNum: uniqueNum,
                            avatarPath: result.avatarPath,
                            nickname: result.nickname,
                            content: content
                        }
                        var talkCenter = client.db('Blog').collection('talkCenter')
                        talkCenter.findOne({ colectionName: "talkCenter" }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                let commentDataArr = result_1.commentData;
                                commentDataArr.push(commentData)
                                talkCenter.updateOne(
                                    {
                                        colectionName: "talkCenter"
                                    },
                                    {
                                        $set: {
                                            commentData: commentDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result => {
                                    res.status(200).send(JSON.stringify({ commentData: commentDataArr }))
                                    client.close()
                                })
                            }
                        })
                    }
                })
            }
            )
        }

    })
    //留言点击第一层回复按钮
    app.post("/talkReplyOne", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        if (req.user_id.length == 0) {
            console.log("需要重定向")
        } else {
            let { content, recieverNum, recieverNickname } = req.body;
            let user_id = req.user_id;

            //查询用户的avatarPath就行  
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                client.db('Blog').collection('users').findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        let uniqueNum = uuid()
                        let replyOneData = {
                            senderId: result._id,
                            senderAvatarPath: result.avatarPath,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            uniqueNum: uniqueNum,
                            content: content,
                            recieverNickname: recieverNickname
                        }
                        var talkCenter = client.db('Blog').collection('talkCenter')
                        talkCenter.findOne({ colectionName: "talkCenter" }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                let replyOneDataArr = result_1.replyOneData;
                                replyOneDataArr.push(replyOneData)
                                talkCenter.updateOne(
                                    {
                                        colectionName: "talkCenter"
                                    },
                                    {
                                        $set: {
                                            replyOneData: replyOneDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result => {
                                    res.status(200).send(JSON.stringify({ replyOneData: replyOneDataArr }))
                                    client.close()
                                })
                            }
                        })
                    }
                })
            }
            )
        }

    })
    //留言点击第一层回复按钮
    app.post("/talkReplyTwo", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        if (req.user_id.length == 0) {
            console.log("需要重定向")
        } else {
            let { content, recieverNum, upNum, recieverNickname } = req.body;
            let user_id = req.user_id;

            //查询用户的avatarPath就行  
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                client.db('Blog').collection('users').findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        let replyTwoData = {
                            senderId: result._id,
                            senderAvatarPath: result.avatarPath,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            upNum: upNum,
                            recieverNickname: recieverNickname,
                            content: content
                        }
                        var talkCenter = client.db('Blog').collection('talkCenter')
                        talkCenter.findOne({ colectionName: "talkCenter" }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                let replyTwoDataArr = result_1.replyTwoData;
                                replyTwoDataArr.push(replyTwoData)
                                talkCenter.updateOne(
                                    {
                                        colectionName: "talkCenter"
                                    },
                                    {
                                        $set: {
                                            replyTwoData: replyTwoDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result => {
                                    res.status(200).send(JSON.stringify({ replyTwoData: replyTwoDataArr }))
                                    client.close()
                                })
                            }
                        })
                    }
                })
            }
            )
        }

    })
    
}

// var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// var { MongoClient, ObjectId } = require('mongodb')

