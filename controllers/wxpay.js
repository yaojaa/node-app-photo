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

    //获取参数
    var openid, product_id;
    var userid = req.session.user.id;
    if (userid) {
        return res.fail('用户没有登录');
    }

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
        //调用统一下单API，获取交易会话标示（prepay_id）
        unifiedOrder(order._id, openid, callback);
    }, function (sign, order, callback) {
        requestUnifiedOrder(sign, order, callback);
    }, function (prepay_id, callback) {
        //返回（prepay_id）并让用户完成支付
    }], function (err, user) {
        if (err) {
            console.error('[controller][wxpay][callback]', err.stack);
            return res.fail(err.message);
        }
    });
};

//制作支付二维码
exports.makeQRcode = function (req, res) {

    var product_id = req.params.productid;
    if (wxutil.validObjectId(product_id)) {
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
function unifiedOrder(orderId, openid, callback) {
    try {
        var nonce_str = generator.generate();
        var order = {
            appid: appid,
            openid: openid,
            mch_id: mch_id,
            is_subscribe: 'N',
            nonce_str: nonce_str,
            product_id: orderId
        };
        var params = wxutil.handleParam(order);
        var sign = wxutil.handleSign(params);
        callback(null, sign, order);
    } catch (e) {
        callback(e);
    }
}

//请求统一下单
function requestUnifiedOrder(sign, order, callback) {
    var data = '<xml>' +
        '<appid>wx2421b1c4370ec43b</appid>' +
        '<attach>支付测试</attach>' +
        '<body>JSAPI支付测试</body>' +
        '<mch_id>10000100</mch_id>' +
        '<nonce_str>1add1a30ac87aa2db72f57a2375d8fec</nonce_str>' +
        '<notify_url>http://wxpay.weixin.qq.com/pub_v2/pay/notify.v2.php</notify_url>' +
        '<openid>oUpF8uMuAJO_M2pxb1Q9zNjWeS6o</openid>' +
        '<out_trade_no>1415659990</out_trade_no>' +
        '<spbill_create_ip>14.23.150.211</spbill_create_ip>' +
        '<total_fee>1</total_fee>' +
        '<trade_type>JSAPI</trade_type>' +
        '<sign>0CB01533B8C1EF103065174F50BCA001</sign>' +
        '</xml>';

    request({url: unifiedorder_url}, function (error, response, body) {
        callback(error, response, body);
    });

}

/*
 <xml><appid><![CDATA[wxf849f8f6fce31880]]></appid>
 <openid><![CDATA[on_LUvtWknLq5PgC2hLD-Tf3UeiY]]></openid>
 <mch_id><![CDATA[1320356201]]></mch_id>
 <is_subscribe><![CDATA[Y]]></is_subscribe>
 <nonce_str><![CDATA[SLZTjWA4czLXXNxi]]></nonce_str>
 <product_id><![CDATA[56c9c130c90fa88011f61e01]]></product_id>
 <sign><![CDATA[B9F8CF711BACEDDD484C2DCAA90CBCED]]></sign>
 </xml>
 */