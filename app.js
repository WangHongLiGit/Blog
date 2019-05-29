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



    var urlString="http://127.0.0.1:4000";


    var express = require("express");
    var app = express();
    app.listen(4000,'0.0.0.0')

    app.use('/static',express.static('./views/index/build/static'))
    app.use("/blogItems", express.static('./blogItems'))
    app.use("/avatars", express.static('./avatars'))


    //mongoDB
    var mongodb = require("mongodb");
    var { MongoClient, ObjectId } = mongodb
    var uuid = require('uuid')



    //cookieParser
    var cookieParser = require("cookie-parser");
    app.use(cookieParser())

    var basePath = './avatars'
    var formidable = require('formidable')
    var path = require('path')
    var fs = require("fs")


    

    //我们只是在sessionData里面获取用户ID
    //没有获取到  就是没有登录
    //获取到了就是登陆了
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
    





    //我们需要时刻更新blogcenter   先放在这里
    // app.use(function (req, res, next) {
    //     fs.readdir("./blogItems", function (err, data) {
    //         data.forEach(function (e) {
    //             fs.readFile(`./blogItems/${e}/1.md`, function (err, fileData) {
    //                 var fileString = fileData.toString();
    //                 var preIndex = fileString.indexOf("#") + 1;
    //                 var nextIndex = fileString.indexOf("`")
    //                 var title = fileString.substring(preIndex, nextIndex)
    //                 var readme = fileString.substring(nextIndex, nextIndex + 50)
    //                 console.log(e,title,readme)
    //                 MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
    //                     if (connectError) {
    //                         res.status(500).send({ code: 500, msg: "服务器链接错误" })
    //                         return
    //                     }


    //                     var BlogCenter = client.db('Blog').collection('BlogCenter')
    //                     BlogCenter.findOne({ direcionNum: e }, function (error, result) {
    //                         if (error) {
    //                             res.status(500).send({ code: 500, msg: "服务器查询错误" })
    //                             return
    //                         }
    //                         if (result) {
    //                             //在已有的文章中只更新  title和readme和blogLogoPath
    //                             BlogCenter.updateOne(
    //                                 {
    //                                     direcionNum: e
    //                                 },
    //                                 {
    //                                     $set: {
    //                                         title: title,
    //                                         readme: readme,
    //                                         blogLogoPath: `http://127.0.0.1:4000/blogItems/${e}/logo.jpg`   //暂时用绝对路径
    //                                     }
    //                                 },
    //                                 {
    //                                     upsert: true
    //                                 }
    //                             ).then(result => {
    //                                 client.close()
    //                             })
    //                         } else {
    //                             //对于新的的文章  插入整个数据结构
    //                             BlogCenter.insertOne({
    //                                 title: title,
    //                                 readme: readme,
    //                                 blogLogoPath: `http://127.0.0.1:4000/blogItems/${e}/logo.jpg`,   //暂时用绝对路径
    //                                 direcionNum: e,
    //                                 viewNUm: "0",
    //                                 commentNum: "0",
    //                                 commentData: [],
    //                                 replyOneData: [],
    //                                 replyTwoData: []
    //                             }, function (error, result) {
    //                                 if (error) {
    //                                     res.status(500).send({ code: 500, msg: "服务器查询错误" })
    //                                     return
    //                                 }
    //                                 client.close()
    //                             })

    //                         }
    //                     })

    //                 })
    //             })
    //         })

    //     })
    //     next()
    // })



    //localHost和127.0.0.1属于不同域名是
    //Access to XMLHttpRequest at 'http://127.0.0.1:4000/login'
    // from origin 'http://localhost:3000' has been blocked by CORS policy: 
    //The 'Access-Control-Allow-Origin' header has a value 'http://127.0.0.1:3000' that is not equal to the supplied origin.

    //跨域问题(Ajax和cookie)
    app.use((req, res, next) => {
        console.log('处理的线程 - ', process.pid, ' 请求 - ', req.method, ' ', req.url)
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
        res.setHeader('Access-Control-Allow-Headers', 'content-type,x-requested-with')
        res.setHeader("Access-Control-Allow-Credentials", "true")
        next()

    })

    app.get('/',function(req,res){
        res.sendFile(path.resolve('./views/index/build/index.html'))
    })

    //改变昵称接口
    app.post("/changeNickName", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        var { nickname } = req.body;
        //找到了匹配的user_id
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            if (connectError) {
                res.status(500).send({ code: 500, msg: "服务器链接错误" })
                return
            }
            var users = client.db('Blog').collection('users');
            users.updateOne(
                {
                    _id: req.user_id
                },
                {
                    $set: {
                        nickname: nickname
                    }
                },
                {
                    upsert: true     //如果不存在这个数据  是否插入这个数据
                }
            ).then(result => {
                res.send({ code: 200, msg: "更改昵称成功" })
                client.close()
            })
        })
    })


    //获取个人信息
    app.get("/getInfo/:sendData", function (req, res) {
        if (req.user_id.length == 0) {
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var sendData = req.params.sendData;
            //找到了匹配的user_id
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                var users = client.db('Blog').collection('users');
                //先查找出来原有的avatarPath
                users.findOne({ "_id": ObjectId(req.user_id) }, function (error, userfindResult) {
                    if (error) {
                        res.status(500).send({ code: 2005, msg: "数据库查询错误" })
                        return
                    }
                    if (userfindResult) {
                        if (sendData == "nickname") {
                            console.log(sendData)
                            res.status(200).send({ nickname: userfindResult.nickname })
                        }
                    }
                })

            })
        }
    })


    //特殊接口:返回头像请求的数据
    app.get("/returnAvator/:userId", function (req, res) {
        //这里我们在发送的时候随机生成了三位尾码  我们要提取出24位有效的id
        var userId = req.params.userId.slice(0, 24);
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            var users = client.db('Blog').collection('users');
            users.findOne({ _id: ObjectId(userId) }, function (error, result) {
                if (result) {
                    client.close()
                    res.sendFile(__dirname + result.avatarPath.slice(21, 100))
                }
            })
        })

    })

    //登录接口
    app.post("/login", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        var { account, password } = req.body;
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
                            upsert: true     //如果不存在这个数据  是否插入这个数据
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

    //判断是否被注册接口
    app.post("/isRegistered", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        var { account } = req.body;
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

    //注册接口
    app.post("/register", require("body-parser").urlencoded({ extended: false }), function (req, res) {
        var { account, password, nickname } = req.body;
        var random = parseInt(Math.random() * (7)) + (1);
        MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
            if (connectError) {
                res.status(500).send({ code: 500, msg: "服务器链接错误" })
                return
            }
            client.db('Blog').collection('users').insert({
                account,
                password,
                nickname,
                avatarPath: `${urlString}/avatars/defualtAvatar/${random}.jpg`,    //暂时设置默认头像文件里面的头像
            }, function (error, result) {
                if (error) {
                    res.status(500).send({ code: 500, msg: "服务器插入错误" })
                    return
                }
                res.status(200).send({ code: 200, msg: "注册成功" })
            })
        }
        )
    })

    //获取单个博客数据
    app.get("/getBlogItem/:direcionNum", function (req, res) {
        var blogPath = `./blogItems/${req.params.direcionNum}/1.md`
        console.log("caaaaaaaaaaaa", blogPath)
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

                    BlogCenter.updateOne(
                        {
                            direcionNum: req.params.direcionNum
                        },
                        {
                            $set: {
                                viewNUm: (Number(result.viewNUm) + 1).toString()
                            }
                        },
                        {
                            upsert: true
                        }
                    ).then(result_2 => {
                        client.close()
                    })
                }
            })
        })
        console.log("读取路径", blogPath)

    })

    //获取全部博客
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

    //获取热门博客
    app.get("/hotBlogCenter", function (req, res) {
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
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var { content, direcionNum } = req.body;
            var user_id = req.user_id;
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                var users = client.db('Blog').collection('users');
                users.findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        var uniqueNum = uuid()

                        var commentData = {
                            senderId: result._id,
                            uniqueNum: uniqueNum,
                            avatarPath: `$(urlString)/returnAvator/` + result._id,
                            nickname: result.nickname,
                            content: content
                        }
                        var BlogCenter = client.db('Blog').collection('BlogCenter')
                        BlogCenter.findOne({ direcionNum: direcionNum }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                var commentDataArr = result_1.commentData;
                                commentDataArr.push(commentData)
                                BlogCenter.updateOne(
                                    {
                                        direcionNum: direcionNum
                                    },
                                    {
                                        $set: {
                                            commentNum: (Number(result_1.commentNum) + 1).toString(),
                                            commentData: commentDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result_2 => {
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
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var { content, recieverNum, direcionNum, recieverNickname,reciverId} = req.body;
            var user_id = req.user_id;

            //查询用户的avatarPath就行  
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                var users = client.db('Blog').collection('users');
                users.findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        var uniqueNum = uuid()
                        var replyOneData = {
                            senderId: result._id,
                            senderAvatarPath: `${urlString}/returnAvator/` + result._id,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            reciverId:reciverId,
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
                                var replyOneDataArr = result_1.replyOneData;
                                replyOneDataArr.push(replyOneData)
                                BlogCenter.updateOne(
                                    {
                                        direcionNum: direcionNum
                                    },
                                    {
                                        $set: {
                                            commentNum: (Number(result_1.commentNum) + 1).toString(),
                                            replyOneData: replyOneDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result_2 => {
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
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var { content, recieverNum, direcionNum, upNum, recieverNickname,reciverId} = req.body;
            var user_id = req.user_id;

            //查询用户的avatarPath就行  
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }
                var users = client.db('Blog').collection('users');
                users.findOne({ _id: ObjectId(user_id) }, function (error, result) {
                    if (error) {
                        res.status(500).send({ code: 500, msg: "服务器查询错误" })
                        return
                    }
                    if (result) {
                        var replyTwoData = {
                            senderId: result._id,
                            senderAvatarPath: `${urlString}/returnAvator/` + result._id,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            reciverId:reciverId,
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
                                var replyTwoDataArr = result_1.replyTwoData;
                                replyTwoDataArr.push(replyTwoData)
                                BlogCenter.updateOne(
                                    {
                                        direcionNum: direcionNum
                                    },
                                    {
                                        $set: {
                                            commentNum: (Number(result_1.commentNum) + 1).toString(),
                                            replyTwoData: replyTwoDataArr
                                        }
                                    },
                                    {
                                        upsert: true
                                    }
                                ).then(result_2 => {
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
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var { content,reciverId} = req.body;
            var user_id = req.user_id;
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
                        var uniqueNum = uuid()

                        var commentData = {
                            senderId: result._id,
                            uniqueNum: uniqueNum,
                            avatarPath: `${urlString}/returnAvator/` + result._id,
                            nickname: result.nickname,
                            content: content
                        }
                        var talkCenter = client.db('Blog').collection('talkCenter')
                        talkCenter.findOne({ colectionName: "talkCenter" }, function (error, result_1) {
                            if (error) {
                                res.status(500).send({ code: 500, msg: "服务器查询错误" })
                            }
                            if (result_1) {
                                var commentDataArr = result_1.commentData;
                                commentDataArr.push(commentData)
                                talkCenter.updateOne(
                                    {
                                        colectionName: "talkCenter"
                                    },
                                    {
                                        $set: {
                                            commentNum: (Number(result_1.commentNum) + 1).toString(),
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
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var { content, recieverNum, recieverNickname,reciverId} = req.body;
            var user_id = req.user_id;

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
                        var uniqueNum = uuid()
                        var replyOneData = {
                            senderId: result._id,
                            senderAvatarPath: `${urlString}/returnAvator/` + result._id,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            reciverId:reciverId,
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
                                var replyOneDataArr = result_1.replyOneData;
                                replyOneDataArr.push(replyOneData)
                                talkCenter.updateOne(
                                    {
                                        colectionName: "talkCenter"
                                    },
                                    {
                                        $set: {
                                            commentNum: (Number(result_1.commentNum) + 1).toString(),
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
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var { content, recieverNum, upNum, recieverNickname,reciverId} = req.body;
            var user_id = req.user_id;

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
                        var replyTwoData = {
                            senderId: result._id,
                            senderAvatarPath: `${urlString}/returnAvator/` + result._id,
                            senderNickname: result.nickname,
                            recieverNum: recieverNum,
                            reciverId:reciverId,
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
                                var replyTwoDataArr = result_1.replyTwoData;
                                replyTwoDataArr.push(replyTwoData)
                                talkCenter.updateOne(
                                    {
                                        colectionName: "talkCenter"
                                    },
                                    {
                                        $set: {
                                            commentNum: (Number(result_1.commentNum) + 1).toString(),
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

    //获取用户头像路径
    app.get("/getAvatarPath", function (req, res) {
        if (req.user_id.length == 0) {
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            var user_id = req.user_id;
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
                        res.status(200).send(JSON.stringify({ userAvatarPath: result.avatarPath }))
                        client.close()
                    }
                })
            })
        }
    })

    //上传头像并删除原有头像
    app.post('/upload_avator', function (req, res) {
        if (req.user_id.length == 0) {
            res.status(404).send({ code: 302, meg: "需要重定向" })
        } else {
            //找到了匹配的user_id
            MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
                if (connectError) {
                    res.status(500).send({ code: 500, msg: "服务器链接错误" })
                    return
                }

                //创建IncomingForm对象
                var form = new formidable.IncomingForm()
                //设置上传文件存放的文件夹
                form.uploadDir = "./avatars"
                console.log("设置上传文件存放的文件夹", form.uploadDir)

                //该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息  files
                form.parse(req, function (err, fields, files) {
                    //确实应该考考虑没有设置头像的问题  需要多个状态码
                    if (!files.avator_file) {
                        res.status(500).send({ code: 2000, msg: "没有设置头像" })
                    }
                    console.log("看看请求中的数据转换", files)
                    //这个是根据传过来的files对象找到path: 'avatars\\upload_ebe5cf90fd0313859503cb44bdbed2e6',
                    //注意：——————————————————————————————————————————————————————————————真正的项目中我们要把它去掉
                    var avatarPathStr = `${urlString}/` + files.avator_file.path;
                    var avatarPath = avatarPathStr.replace(/\\/g, '/')
                    var users = client.db('Blog').collection('users')

                    //先查找出来原有的avatarPath
                    users.findOne({ "_id": ObjectId(req.user_id) }, function (error, userfindResult) {
                        if (error) {
                            res.status(500).send({ code: 2005, msg: "数据库查询错误" })
                            return
                        }
                        //替换路径中的//  更新user表中的数据    注意设置数据库中的路径都设置成相对路径   为了方便调试我们暂时设置成绝对路径
                        users.updateOne({ "_id": ObjectId(req.user_id) }, { $set: { "avatarPath": avatarPath } }, function (err, result) {
                            if (err) {
                                res.status(500).send({ code: 2005, msg: "数据库更新错误" })
                                return
                            }
                            res.status(200).send(JSON.stringify({ avatarPath: avatarPath }))
                        })

                        //(一)如果原有的头像路径没有defualtAvatar字段   则就不是默认原图像  要删除原有图片
                        if (userfindResult.avatarPath.indexOf("defualtAvatar") == -1) {
                            fs.unlink("./" + userfindResult.avatarPath.slice(21, 600), function (err) {
                                console.log("删除文件成功")
                                if (err) {
                                    console.log(err)
                                    return
                                }
                            })
                        }
                    })
                    form.onPart = (part) => {
                        if (part.filename === "") {
                            return
                        }
                        form.handlePart(part)
                    }
                })

            })
        }
    })
}






