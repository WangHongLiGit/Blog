var mongodb = require('mongodb')
var { MongoClient, ObjectId } = mongodb
var uuid = require('uuid')

var initSessionMiddleWare = function () {
    return {
        getUserId: function () {
            return new Map
        },
        initSessionData: function () {
            // 请求进来时先在数据库获取session初始化
            return (req, res, next) => {
                MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }).then(client => {
                    var sessionData = client.db('Blog').collection('sessionData')
                    sessionData.findOne({"token": req.co},function(err,result){


                    })
                    //这个map目前对我来没有什么用
                    // _session_data.find({}).toArray().then(data => {
                    //     if(data){
                    //         console.log("data不为空",data)
                    //         client.close()
                    //         req.session = data.slice()
                    //         var user_id = new Map
                    //         var expire = new Map
                    //         for (var i = 0; i < data.length; i++) {
                    //             var u = data[i]
                    //             user_id.set(u.token, u.user_id)
                    //             expire.set(u.token, u.expire)
                    //         }
                    //         req.user_id = user_id
                    //         req.expire = expire
                    //         next()
                    //     }else{
                    //         console.log("data为空")
                    //         req.user_id = ""
                    //         req.expire = ""
                    //     }
                    // })
                })
            }
        },
    }
}

module.exports = initSessionMiddleWare