var User = require('../proxy/user');
var Order = require('../proxy/order');
var async = require('async');
var request = require('request');
var Photo = require('../proxy/photo.js');
var Order = require('../proxy/order.js');
var generator = require('../util/randomStatusGenerator');
var wxutil = require('../util/wxutil');
var config = require('../config').wxpay;
var qr = require('qr-image');


/**
 * 个人钱包支付
 * @param money
 * @param balance
 * @param buyId
 * @param sellId
 * @param req
 * @param callback
 * @todo 因为mongodb没有事务不推荐使用，建议使用MySql
 */
exports.personalWallet = function (money, buyId, sellId, callback) {

    async.series([function (cb) {
        //购买者减少
        User.update(buyId, {'$inc': {'money': -money}},cb);
    }, function (cb) {
        //销售者增加
        User.update(sellId, {'$inc': {'money': money}},cb);
    }], callback);
};

//生成微信支付二维码
exports.wxpay = function (money, buyId, productId, orderId, callback) {


    async.waterfall([function (callback) {
        //处理统一下单
        unifiedOrder(orderId, productId, money, callback)
    }, function (ret, callback) {
        //请求处理统一下单
        try {
            var retXml = wxutil.parseXml(ret);
            requestUnifiedorder(retXml, callback);
        } catch (e) {
            callback(e);
        }
    }, function (r, body, callback) {
        //获取微信请求的返回值，
        try {
            console.log('微信请求统一下单返回的信息：', body);
            wxutil.parseString(body, callback);
        } catch (e) {
            callback(e);
        }
    }, function (ret, callback) {
        if (ret.return_code !== 'SUCCESS') {
            return callback(new Error(ret.return_msg));
        }
        if (ret.result_code !== 'SUCCESS') {
            return callback(new Error(ret.return_msg));
        }
        //验证返回信息是否合法
        var boo = wxutil.validSign(ret);
        if (boo) {
            callback(null, ret);
        } else {
            callback(new Error('微信返回信息签名验证失败'));
        }
    }], function (err, ret) {
        try {
            if (err) {
                console.error('[controller][wxpay][callback]', err.stack);
                return res.fail(err.message, res);
            }
            console.log('预支付ID(prepay_id):', ret.prepay_id);
            console.log('二维码链接(code_url):', ret.code_url);
            var img = qr.image(ret.code_url, {size: 10});
            callback(null, img);
        } catch (e) {
            console.log(e.stack);
            callback(e);
        }

    });


};


/**
 * 生成订单信息
 * @param buyId 购买者
 * @param sellId 销售者
 * @param productId 产品ID
 * @param trading_type 交易类型1：购买，2：打赏
 * @param trading_channel 交易渠道， 1：个人钱包， 2：微信，3：支付宝，4：个人钱包+微信，5：个人钱包+支付宝
 * @param price 商品价格
 * @param callback
 */
exports.generateOrderInfo = function (buyId, sellId, productId, trading_type, trading_channel, price, callback) {
    var order = {
        buy_id: buyId,
        product_id: productId,
        author_id: sellId,
        trading_type: trading_type,
        trading_channel: trading_channel,
        price: price || 0
    };
    Order.add(order, callback);
};

/**
 * 更新订单信息
 * @param id
 * @param model
 * @param callback
 */
exports.updateOrderInfo = function (id, model, callback) {
    var order = {
        status: model.status
    };
    if (model.openid) {
        order.openid = model.openid;
    }
    Order.update(id, order, callback);
};


//处理统一下单处理
function unifiedOrder(orderId, productId, price, callback) {
    try {
        var nonce_str = generator.generate();
        var order = {
            appid: config.appid,
            mch_id: config.mch_id,
            is_subscribe: 'N',
            nonce_str: nonce_str,
            product_id: productId,
            out_trade_no: orderId,
            body: '款项全部支付给作者',
            total_fee: price,
            spbill_create_ip: '123.56.230.118',
            trade_type: 'NATIVE',
            notify_url: 'http://www.fengimage.com/pub/wxpay/notify'
        };
        var params = wxutil.handleParam(order);
        console.log('#1.生成字符串：\n', params);
        var sign = wxutil.handleSign(params);
        console.log('#2.生成的sign：\n', sign);
        order.sign = sign;
        callback(null, order);
    } catch (e) {
        callback(e);
    }
}

//请求统一下单
function requestUnifiedorder(body, callback) {
    request({
        method: 'POST',
        url: config.unifiedorder_url,
        body: body
    }, callback);
}