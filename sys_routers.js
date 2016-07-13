var express = require('express');
var main = require('./controllers/sys/main');
var user = require('./controllers/sys/user');
var photo = require('./controllers/sys/photo');
var aticle = require('./controllers/sys/aticle');
var order = require('./controllers/sys/order');

var router = express.Router();

router.use(function (req, res, next) {
    var user = req.session.sysUser;
    if (user) {
        console.log("user name === " + user['login_name']);
    } else {
        console.log("user no login ");
    }
    var path = req.originalUrl;
    if (!user && path != '/sys/login') {
        if (req.xhr) {
            res.send({status: "002", msg: "no login"});
        } else {
            res.redirect('/sys/login');
        }
    } else {
        next();
    }
});

router.get('/', function (req, res) {
    out(req, res, 'admin/index');
})

router.get('/login', function (req, res) {
    res.render('sys/login', {layout: null});
});

router.post('/login', main.login);

router.get('/logout', main.logout);

router.get('/user/list', function (req, res) {
    out(req, res, 'sys/user_list');
});

router.post('/user/list', main.page);

router.post('/user/add', main.save);

router.post('/user/repwd', main.repwd);


//网站用户管理
router.get('/uc/list', function (req, res) {
    out(req, res, 'sys/uc_list');
});
router.post('/uc/list', user.page);
router.post('/uc/:id', user.detail);

//网站图集管理
router.get('/photo/list', function (req, res) {
    out(req, res, 'sys/photo_list');
});
router.post('/photo/list', photo.page);
router.get('/photo/del/:id', photo.del);
router.get('/photo/:id', photo.detail);


//网站图文管理
router.get('/aticle/list', function (req, res) {
    out(req, res, 'sys/aticle_list');
});
router.post('/aticle/list', aticle.page);
router.get('/aticle/del/:id', aticle.del);
router.get('/aticle/:id', aticle.detail);

//订单管理
router.get('/order/list', function (req, res) {
    out(req, res, 'sys/order_list');
});
router.post('/order/list', order.page);

function out(req, res, view, data) {
    var user = req.session.sysUser;
    if (!data) data = {};
    data.layout = 'admin';
    data.loginname = user['login_name'];
    res.render(view, data);
}

module.exports = router;