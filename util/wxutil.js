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
        bufferArr.push(chunk);
        var postData = Buffer.concat(bufferArr).toString();
        if (postData) req._body = postData;
        callback(postData);
    });
}

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
}

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
}

//生成签名
exports.handleSign = function (params) {
    var str = params + '&key=' + config.api_secret;
    var md5 = crypto.createHash('md5');
    md5.update(str);
    str = md5.digest('hex').toUpperCase();
    return str;
}

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

var data = '<xml><appid><![CDATA[wxf849f8f6fce31880]]></appid>' +
    '<openid><![CDATA[on_LUvtWknLq5PgC2hLD-Tf3UeiY]]></openid>' +
    '<mch_id><![CDATA[1320356201]]></mch_id>' +
    '<is_subscribe><![CDATA[Y]]></is_subscribe>' +
    '<nonce_str><![CDATA[SLZTjWA4czLXXNxi]]></nonce_str>' +
    '<product_id><![CDATA[56c9c130c90fa88011f61e01]]></product_id>' +
    '<sign><![CDATA[B9F8CF711BACEDDD484C2DCAA90CBCED]]></sign>' +
    '</xml>';

var config = require('../config').wxpay;
//处理统一下单处理
function unifiedOrder(orderId, openid, callback) {
    try {
        var nonce_str = 'sfgdfgerggdgfdgdgdfggdfgagh';
        var order = {
            appid: config.appid,
            openid: openid,
            mch_id: config.mch_id,
            is_subscribe: 'Y',
            nonce_str: nonce_str,
            product_id: orderId
        };
        var params = exports.handleParam(order);
        var sign = exports.handleSign(params);
        order.sign = sign;
        callback(null, order);
    } catch (e) {
        callback(e);
    }
}

unifiedOrder('324235353gvdf', 'dgdsgs', function (err, order) {
    console.log(exports.parseXml(order));
});
