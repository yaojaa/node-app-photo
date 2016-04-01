var Eventproxy = require('eventproxy');
var wxutil = require('../util/wxutil');
var PhotoProxy = require('../proxy').Photo;

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
    var t1 = req.params.t1;
    var t2 = req.params.t2;
    var productid = req.params.productid;
    var money = req.query.money;

    //参数验证
    var pass = ['1', '2'].indexOf(t2) > -1;
    if (!pass) {
        return res.fail('参数错误');
    }

    pass = ['1', '2', '3', '4', '5'].indexOf(t1) > -1;
    if (!pass) {
        return res.fail('参数错误');
    }

    //id不合法，返回首页
    if (!wxutil.validObjectId(productid)) {
        console.log('id不合法...');
        return res.fail('参数错误');
    }
};