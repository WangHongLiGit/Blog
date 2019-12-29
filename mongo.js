var express = require("express");
var app = express();
app.listen(4000, '0.0.0.0')
var mongodb = require("mongodb");
var { MongoClient, ObjectId } = mongodb

MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, function (connectError, client) {
    if (connectError) {
        console.log(connectError)
        return
    }
    let users = client.db('Blog').collection('users');
    let BlogCenter = client.db('Blog').collection('BlogCenter');
    let talkCenter = client.db('Blog').collection('talkCenter');
    let sessionData = client.db('Blog').collection('sessionData');


    //————————————————————————————————————在服务器中生成默认数据库表————————————————————————————
    //1.创建一个user表   并插入一个数据  
    users.insertOne({
        "_id": ObjectId("111111111111111111111111"),
        "account": "11111",
        "password": "11111",
        "nickname": "HongLi",
        "avatarPath": "/avatars/logo.jpg"
    }, function (err, result) {
        if (err) {
            console.log(err)
            return
        }
        console.log("新博主插入成功")
    })


    //1.创建一个talkCenter表   并插入一个数据  
    talkCenter.insertOne({
        "_id": ObjectId("5ce56639ba591237f4f68ab8"),
        "colectionName": "talkCenter",
        "commentData": [
        ],
        "replyOneData": [
        ],
        "replyTwoData": [
        ]
    }, function (err, result) {
        console.log("talkCenter设置成功")
    })

    //sessionData表格不用创建
    //BlogCenter表格不用创建

    users.find({}).toArray(function (err, result) {
        console.log("users表格", result)
    })
    BlogCenter.find({}).toArray(function (err, result) {
        console.log("BlogCenter表格", result)
    })
    sessionData.find({}).toArray(function (err, result) {
        console.log("sessionData表格", result)
    })
    talkCenter.find({}).toArray( function (err, result) {
        console.log("talkCenter表格", result)
    })

})