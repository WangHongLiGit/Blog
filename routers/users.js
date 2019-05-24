var cluster = require('cluster');
var http = require('http');
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
    app.listen(3000)

    var bodyParser = require("body-parser");
    var mongodb = require("mongodb");
    var {MongoClient,ObjectId}=mongodb


    app.post("/login",bodyParser,function(req,res){
        

    })




}
// var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// var { MongoClient, ObjectId } = require('mongodb')

