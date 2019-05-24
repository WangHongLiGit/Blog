//在使用中间件之间先定义一个错误map
//在ma中定义好  常用错误如  
//在此方法中:   如果传过来的错误在map中找到了  就直接传   没有就按照原本的传输错误

/**错误处理工具：
 * 
 * 针对已知状态码错误处理：handleError  
 *     直接将状态码设置到statsu中  因为这些使已知错误  500服务器错误   400非法数据   403 forbiden
 * 
 * 自定义code的400错误处理  
 *     status是400   自定义code:1001  然后传递
 */





var handleError = function (errorMap) {
    return (req, res, next) => {
        res.handleError = function (errorStatusNumber, otherMsg) {
            if (errorMap.has(errorStatusNumber)) {
                res.status(errorStatusNumber).send({
                    code: errorStatusNumber,
                    msg: otherMsg || errorMap.get(errorStatusNumber)
                })
            } else {
                res.send({
                    code: 444,
                    msg: 'unknow error'
                })
            }
        },
            res.handleError400 = function (errorStatusNumber, otherMsg) {
                res.status(400).send({
                    code: errorStatusNumber,
                    msg: otherMsg || errorMap.get(errorStatusNumber)
                })
            }
        next()
    }

}

module.exports = handleError