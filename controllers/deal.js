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