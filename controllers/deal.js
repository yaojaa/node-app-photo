/**
 * @Desc: 该文件统一处理交易接口，交易分为购买和打赏，
 * 大致过程：
 *  1：用户调用统一下单接口（handle），系统会自动生成一个订单信息，返回用户一个订单id
 *  2：用户根据订单ID调用支付接口（pay），根据支付流程完成支付
 *  3：用户调用订单状态接口（get），实时查看订单状态，当状态为1时，完成订单支付！
 */


var Eventproxy = require('eventproxy');
var wxutil = require('../util/wxutil');
var PhotoProxy = require('../proxy').Photo;
var User = require('../proxy/user');
var dealService = require('../proxy/deal');
var Order = require('../proxy/order');
var crypto = require('crypto');
var async = require('async');

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

//查询订单状态
exports.get = function (req, res) {
    var orderId = req.params.orderId;
    //id不合法
    if (!wxutil.validObjectId(orderId)) {
        console.log('id不合法...');
        return res.fail('参数错误');
    }
    Order.getOrderById(orderId, function (err, ret) {
        if (err) {
            return res.fail('获取订单信息失败');
        }
        return res.ok({id: ret._id, status: ret.status});
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
        return res.fail(-2,'获取用户信息失败');
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

            //生成订单信息
            generateOrderInfo(t1, t2, req, res, user.id, photo.author_id, productid, photo.price);

        });

    } else {//打赏
        if (!moneyReg.test(money)) {
            return res.fail('钱的格式不对');
        }
        var fen = parseFloat(money) * 100;
        if (t1 === '1') {//个人钱包支付
            if (fen > user.money) {
                return res.fail('余额不足');
            }
        }

        //生成订单信息
        generateOrderInfo(t1, t2, req, res, user.id, productid, productid, fen);

    }
};

/**
 * 生成预订单信息
 * 将订单ID返回，
 * 根据订单状态查询订单是否完成
 * @param t1
 * @param t2
 * @param req
 * @param res
 * @param buyId
 * @param sellId
 * @param productId
 * @param money
 */
function generateOrderInfo(t1, t2, req, res, buyId, sellId, productId, money) {
    //生成订单信息
    dealService.generateOrderInfo(buyId, sellId, productId, t2, t1, money, function (err, ret) {
        if (err) {
            return res.fail('生成订单信息出错');
        }

        res.ok({id: ret._id});

    });
}

/**
 * 完成支付
 * @param req
 * @param res
 */
exports.pay = function (req, res) {
    var orderId = req.params.orderId;
    var pwd = req.query.pwd;
    if(pwd) {
        var md5 = crypto.createHash('md5');
        pwd = md5.update(pwd).digest('hex');
    }
    var user = req.session.user;
    //用户没有登录
    if (!user) {
        console.log('用户未登录...');
        return res.fail('获取用户信息失败');
    }
    //id不合法
    if (!wxutil.validObjectId(orderId)) {
        console.log('id不合法...');
        return res.fail('参数错误');
    }
    Order.getOrderById(orderId, function (err, ret) {
        console.log('Controller----->',err,ret);
        if (err) {
            return res.fail('获取订单信息失败');
        }
        if (ret.status !== 3) {
            return res.fail('订单已经无法支付');
        }

        var createAt = new Date(ret.create_at);
        if (Date.now() - createAt > 1000 * 60 * 60 * 2) {//订单失效时间2个小时
            dealService.updateOrderInfo(orderId, {status: 4}, function (err) {
                if (err) {
                    console.log('更新订单失效出错：' + err.stack);
                }
            });
            return res.fail('订单已经失效');
        }

        if(ret.trading_channel == 1 && pwd != user.password) {
            return res.fail('支付密码错误');
        }

        //分发支付方式
        dispatchPay(ret, user, req, res, function (err) {
            if (err) {
                console.log('[deal][pay][dispatchPay]', err.stack);
            }
        });
    });
};


/**
 * 分发支付方式
 * @param trading_channel 支付方式
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
 *  @param orderId
 *      订单ID
 *
 * @api public
 */
function dispatchPay(order, user, req, res, callback) {
    //用户的余额
    var balance = user.money;
    switch (order.trading_channel) {
        case 1:
            console.log('个人钱包支付');
            dealService.personalWallet(order.price, order.buy_id, order.author_id, function (err) {
                console.log('[dispatchPay]',err);
                if (!err) {
                    dealService.updateOrderInfo(order._id, {status: 1}, function (err) {
                        if (err) {
                            console.log('交易成功，但更新订单信息失败');
                            res.fail('交易成功，但更新订单信息失败');
                        } else {
                            console.log('交易成功，更新订单信息成功');
                            res.ok('交易成功，更新订单信息成功');
                        }
                    });
                    req.session.user.money = balance - order.price;
                } else {
                    dealService.updateOrderInfo(order._id, {status: 2}, function (err) {
                        if (err) {
                            console.log('交易失败，且更新订单信息失败');
                            res.fail('交易失败，且更新订单信息失败');
                        } else {
                            console.log('交易失败，但更新订单信息失败');
                            res.fail('交易失败，但更新订单信息失败');
                        }
                    });
                }
                callback(err);
            });
            break;
        case 2:
            //调用微信支付接口
            console.log('微信支付');
            dealService.wxpay(order.price, order.buy_id, order.author_id, order._id, function (err, img) {
                if (!err) {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    img.pipe(res);
                } else {
                    res.fail('生成二维码失败');
                }
            });
            break;
        case 3:
            //调用支付宝支付接口
            //sellId +money
            break;
        case 4:
            //调用个人钱包支付
            //调用微信支付接口
            dealService.personalWallet(balance, order.buy_id, order.author_id, function (err) {
                if (err) {
                    res.fail('交易失败');
                } else {
                    req.session.user.money = 0;
                    dealService.wxpay(order.price - balance, order.buy_id, order.author_id, order._id, function (err, img) {
                        if (!err) {
                            res.writeHead(200, {'Content-Type': 'image/png'});
                            img.pipe(res);
                        } else {
                            res.fail('生成二维码失败');
                        }
                    });
                }
                callback(err);
            });

            break;
        case 5:
            //buyId -balance
            //调用支付宝支付接口 money-balance
            //sellId +money
            break;
    }
}


//异步接受微信的支付结果
exports.notify = function (req, res) {
    console.log('---------------->notify');

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
    }, function (ret, callback) {
        //更新订单状态
        var model = {
            status: 1,
            price: ret.total_fee,
            openid: ret.openid
        };
        Order.update(ret.out_trade_no, model, callback);
    }, function (ret, callback) {
        //更新商品所有者的账户金额
        Order.getOrderById(ret._id, function (err, order) {
            if (err) {
                callback(err);
            } else {
                User.update(order.buy_id, {'$inc': {'money': order.price}}, callback);
            }
        });
    }], function (err, ret) {
        if (err) {
            console.error('[controller][wxpay][notify]', err.stack);
            return wxutil.fail(err.message, res);
        }
        console.log('提醒微信支付成功');
        wxutil.ok({}, res);
    });
};