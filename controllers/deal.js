var Eventproxy = require('eventproxy');
var wxutil = require('../util/wxutil');
var PhotoProxy = require('../proxy').Photo;
var User = require('../proxy/user');

//进入商品购买页
exports.buy = function (req, res) {
    var user = req.session.user;
    //用户没有登录，调到登录页
    if (!user) {
        console.log('用户未登录...');
        return res.redirect('/login');
    }

    var id = req.params.id;
    //id不合法，返回首页
    if (!wxutil.validObjectId(id)) {
        console.log('id不合法...');
        return res.redirect('/');
    }

    var hasBuy = user.hasBuy;
    //用户已经购买过该商品
    if (hasBuy != null && hasBuy.length > 0 && hasBuy.indexOf(id) > -1) {
        console.log('用户已经购买过该商...');
        return res.redirect('/');
    }

    PhotoProxy.findPhotoById(id, function (err, photo) {
        if (err) {
            return next()
        }
        if (!photo) {
            console.log('商品不存在...');
            return res.redirect('/');
        }

        res.render('pay', {price: photo.price, photoId: id, money: user.money});
    });

};


/**
 * 处理交易流程
 * @param req
 *  req.params.t1 交易方式
 *      1：个人钱包
 *      2：微信
 *      3：支付宝
 *      4：个人钱包+微信
 *      5：个人钱包+支付宝
 *
 *  req.params.t2 交易类型
 *      1：购买
 *      2：打赏
 *
 *  req.params.productid 商品ID
 *      可能是图集的ID
 *      或打赏用户的ID
 *
 *  req.query.money 打赏的金额（元）
 * @param res
 */
exports.handle = function (req, res) {
    var user = req.session.user;
    var t1 = req.params.t1;
    var t2 = req.params.t2;
    var productid = req.params.productid;
    var money = req.query.money;
    var moneyReg = /^(0|[1-9]\d*)(.\d{1,2})?$/;

    //用户没有登录
    if (!user) {
        console.log('用户未登录...');
        return res.fail('获取用户信息失败');
    }

    //参数验证
    var pass = ['1', '2'].indexOf(t2) > -1;
    if (!pass) {
        return res.fail('参数错误');
    }

    pass = ['1', '2', '3', '4', '5'].indexOf(t1) > -1;
    if (!pass) {
        return res.fail('参数错误');
    }

    //id不合法
    if (!wxutil.validObjectId(productid)) {
        console.log('id不合法...');
        return res.fail('参数错误');
    }

    if (t2 === '1') {//购买
        PhotoProxy.findPhotoById(productid, function (err, photo) {
            if (err) {
                console.log('[deal][handle][findPhotoById]', err.stack);
                return res.fail('系统出错');
            }
            if (!photo) {
                console.log('商品不存在...');
                return res.fail('商品不存在');
            }
            if (t1 === '1') {//个人钱包支付
                if (photo.price > user.money) {
                    return res.fail('余额不足');
                }
            }

            dispatchPay(t1, photo.price, user.money, user.id, photo.author_id, function (err, ret) {
                if (err) {
                    console.log('[deal][handle][dispatchPay]', err.stack);
                    return res.fail('系统出错');
                }
                res.ok();
            });

        });

    } else {//打赏
        if (!moneyReg.test(money)) {
            return res.fail('钱的格式不对');
        }
        var fen = parseFloat('12.11') * 100;
        if (t1 === '1') {//个人钱包支付
            if (fen > user.money) {
                return res.fail('余额不足');
            }
        }

        dispatchPay(t1, fen, user.money, user.id, productid, function (err, ret) {
            if (err) {
                console.log('[deal][handle][dispatchPay]', err.stack);
                return res.fail('系统出错');
            }
            res.ok();
        });
    }
};

/**
 * 分发支付方式
 * @param t
 *      1：个人钱包
 *      2：微信
 *      3：支付宝
 *      4：个人钱包+微信
 *      5：个人钱包+支付宝
 * @param balance
 *      用户的余额
 * @param money
 *      支付的金额
 * @param buyId
 *      购买者或打赏者的ID
 * @param sellId
 *      收益者ID
 *
 * @api public
 */
function dispatchPay(t, money, balance, buyId, sellId, callback) {
    t = parseInt(t);
    switch (t) {
        case 1:
            //buyId -money
            //sellId +money
            break;
        case 2:
            //调用微信支付接口
            //sellId +money
            break;
        case 3:
            //调用支付宝支付接口
            //sellId +money
            break;
        case 4:
            //buyId -balance
            //调用微信支付接口 money-balance
            //sellId +money
            break;
        case 5:
            //buyId -balance
            //调用支付宝支付接口 money-balance
            //sellId +money
            break;
    }
}