var async = require('async');
var request = require('request');
var Photo = require('../proxy/photo.js');
var Order = require('../proxy/order.js');
var generator = require('../util/randomStatusGenerator');
var wxutil = require('../util/wxutil');
var config = require('../config').wxpay;
var qr = require('qr-image');

//微信支付回调处理
exports.callback = function (req, res) {
    console.log('---------------->callback');
    //获取参数
    var openid, product_id;
    var userid = 'FY0001';

    async.waterfall([function (callback) {
        wxutil.parseBody(req, function () {
            console.log('微信回调信息------->', req._body);
            if (req._body) {
                wxutil.parseString(req._body, callback);
            } else {
                callback(new Error('无法接收微信的回复信息'));
            }
        });
    }, function (ret, callback) {
        //验证返回信息是否合法
        var boo = wxutil.validSign(ret);
        if (boo) {
            callback(null, ret);
        } else {
            callback(new Error('微信返回信息签名验证失败'));
        }
    }, function (ret, callback) {
        //获取opendid和product_id
        openid = ret.openid;
        product_id = ret.product_id;
        if (openid && product_id) {
            callback(null, ret);
        } else {
            callback(new Error('获取openid和product_id失败'));
        }
    }, function (ret, callback) {
        //查询商品信息
        Photo.findPhotoById(ret.product_id, callback);
    }, function (product, callback) {
        //生成订单信息，获取订单编号
        if (product == null) {
            callback(new Error('商品不存在'));
        } else {
            generateOrderInfo(product, userid, openid, callback);
        }
    }, function (order, callback) {
        //处理统一下单
        unifiedOrder(order._id, openid, product_id, callback);
    }], function (err, ret) {
        if (err) {
            console.error('[controller][wxpay][callback]', err.stack);
            return wxutil.fail(err.message, res);
        }
        console.log('BEFORE:返回给微信的信息-----> ', JSON.stringify(ret));
        var retXml = wxutil.parseXml(ret);
        console.log('AFTER:返回给微信的信息-----> ', retXml);
        res.end(retXml);
    });
};

//制作支付二维码
exports.makeQRcode = function (req, res) {

    var product_id = req.params.productid;
    if (!wxutil.validObjectId(product_id)) {
        return res.fail('商品ID无效');
    }


    //todo: step1 验证用户是否登录
    //todo: step2 验证该商品是够存在
    //todo: step3 验证用户是否已经购买过该商品
    Photo.findPhotoById(product_id, function (err, model) {
        if (err || model == null) {
            res.fail('商品不存在');
        } else {
            var time_stamp = Date.now();
            var nonce_str = generator.generate();
            var qrcode = {
                time_stamp: time_stamp,
                product_id: product_id,
                nonce_str: nonce_str,
                appid: config.appid,
                mch_id: config.mch_id
            };

            var params = wxutil.handleParam(qrcode);
            var sign = wxutil.handleSign(params);
            var url = config.qrcode_url + '?' + params + '&sign=' + sign;
            var img = qr.image(url, {size: 10});
            res.writeHead(200, {'Content-Type': 'image/png'});
            img.pipe(res);
        }

    });

};

exports.notify = function (req, res) {
    console.log('---------------->notify');
    var prepay_id;

    async.waterfall([function (callback) {
        wxutil.parseBody(req, function () {
            console.log('微信回调信息------->', req._body);
            if (req._body) {
                wxutil.parseString(req._body, callback);
            } else {
                callback(new Error('无法接收微信的回复信息'));
            }
        });
    }, function (ret, callback) {
        //验证返回信息是否合法
        var boo = wxutil.validSign(ret);
        if (boo) {
            callback(null, ret);
        } else {
            callback(new Error('微信返回信息签名验证失败'));
        }
    }, function (ret, callback) {
        prepay_id = ret.prepay_id;
        if (prepay_id) {
            callback(null, prepay_id);
        } else {
            callback(new Error('无法获取prepay_id'));
        }
    }], function (err, ret) {
        if (err) {
            console.error('[controller][wxpay][notify]', err.stack);
            return wxutil.fail(err.message, res);
        }
        var retXml = wxutil.parseXml(ret);
        console.log('返回给微信的信息-----> ' + retXml);
        res.end(retXml);
    });
};


//生成订单信息
function generateOrderInfo(product, userid, openid, callback) {
    var order = {
        product_id: product._id,
        buy_id: userid,
        sale_id: product.author_id,
        openid: openid,
        type: 1,
        price: product.price,
        status: 3
    };
    Order.add(order, callback);
}

//处理统一下单处理
function unifiedOrder(orderId, openid, product_id, callback) {
    try {
        var nonce_str = generator.generate();
        var order = {
            return_code: 'SUCCESS',
            result_code: 'SUCCESS',
            appid: config.appid,
            openid: openid,
            mch_id: config.mch_id,
            is_subscribe: 'N',
            nonce_str: nonce_str,
            product_id: product_id,
            out_trade_no: orderId,
            body: '风影图文',
            total_fee: 1,
            spbill_create_ip: '123.56.230.118',
            trade_type: 'NATIVE',
            notify_url: 'http://www.fengimage.com/pub/wxpay/notify'
        };
        var params = wxutil.handleParam(order);
        var sign = wxutil.handleSign(params);
        order.sign = sign;
        callback(null, order);
    } catch (e) {
        callback(e);
    }
}
