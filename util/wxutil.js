var os = require('os');
var parseString = require('xml2js').parseString;
var Builder = require('xml2js').Builder;
var crypto = require('crypto');
var config = require('../config').wxpay;

// 解析原生的XML BODY
exports.parseBody = function (req, callback) {
    var bufferArr = [];
    req.on("data", function (chunk) {
        bufferArr.push(chunk);
    });
    req.on("end", function (chunk) {
        if (chunk) {
            bufferArr.push(chunk);
        }
        var postData = Buffer.concat(bufferArr).toString();
        if (postData) req._body = postData;
        callback(postData);
    });
};

// 将原生的XML 转json对象
exports.parseString = function (xml, callback) {
    parseString(xml, {trim: true}, function (err, result) {
        if (err) {
            return callback(err);
        }
        var ret = result.xml;
        var item = {};
        for (var key in ret) {
            if (ret[key]) {
                item[key] = ret[key].length === 1 ? ret[key][0] : ret[key];
            }
        }
        callback(null, item);
    });
};

//返回消息json转xml
exports.parseXml = function (ret) {
    var builder = new Builder();
    return builder.buildObject({xml: ret});
};

//处理参数
exports.handleParam = function (params) {
    var keys = Object.keys(params).sort();
    var str = '';
    keys.forEach(function (key, index) {
        if (index !== 0) {
            str += '&';
        }
        str += key + '=' + params[key];
    });
    return str;
};

//生成签名
exports.handleSign = function (params) {
    var str = params + '&key=' + config.api_secret;
    var md5 = crypto.createHash('md5');
    md5.update(str);
    str = md5.digest('hex').toUpperCase();
    return str;
};

//验证ID是否合法
exports.validObjectId = function (id) {
    return /^[0-9a-z]{24}$/.test(id);
};

//验证签名是否合法
exports.validSign = function (ret) {
    var sign = ret.sign;
    delete ret.sign;
    return this.handleSign(this.handleParam(ret)) === sign;
};


//微信支付业务失败封装
exports.fail = function (msg, res) {
    var ret = {
        return_code: 'SUCCESS',
        result_code: 'FAIL',
        err_code_des: msg
    };
    var params = this.handleParam(ret);
    var sign = this.handleSign(params);
    ret.sign = sign;
    if (res) {
        res.end(this.parseXml(ret));
    } else {
        return this.parseXml(ret);
    }
};

var data = {
    "return_code": "SUCCESS",
    "result_code": "SUCCESS",
    "appid": "wxf849f8f6fce31880",
    "openid": "on_LUvtWknLq5PgC2hLD-Tf3UeiY",
    "mch_id": "1320356201",
    "is_subscribe": "N",
    "nonce_str": "ecc2887babd6f8bcb6ea072b8cb4a1dc",
    "product_id": "56c526da8cbde1dc0dca4227",
    "out_trade_no": "56ec30c19f8a7b6d0d0722e0",
    "body": "风影图文",
    "total_fee": 1,
    "spbill_create_ip": "123.56.230.118",
    "trade_type": "NATIVE",
    "notify_url": "http://www.fengimage.com/pub/wxpay/notify",
    "sign": "B99DF02F632014EC13DB21ECA09D3DC0"
};

console.log(exports.parseXml(data));

