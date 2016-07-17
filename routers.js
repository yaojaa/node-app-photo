var express = require('express');
var sysRouter = require('./sys_routers');
var sign = require('./controllers/sign');
var aticle = require('./controllers/aticle');
var photo = require('./controllers/photo');
var video = require('./controllers/video');
var comment = require('./controllers/comment');
var wechat = require('./controllers/wechat');
var qq = require('./controllers/qq');
var weibo = require('./controllers/weibo');
var wxpay = require('./controllers/wxpay');
var deal = require('./controllers/deal');
var search = require('./controllers/search');


var ucenter = require('./controllers/ucenter');
var auth = require('./middlewares/auth');
var local = require('./middlewares/local');
var response = require('./middlewares/response');


var config = require('./config')

var qiniu = require('qiniu');


var app = express();

var router = express.Router();

//添加接口返回函数
router.use(response);
//添加本地变量
router.use(local);

router.get('/', function (req, res) {
    res.render('home', {user: req.session.user})
});

router.get('/ranking', function (req, res) {
    res.render('ranking', {user: req.session.user})
});


//后台接口
router.use('/sys', sysRouter);


// var router = express.route;

// router('/').get(function(req,res){
//   console.log('aaaaaaaaaaaaaa')
//   res.render('home')
// })


router.get('/protocol', function (req, res) {
    res.render('user_protocol');
});  // 用户注册协议

router.get('/password_reset', function (req, res) {
    res.render('user/password_retrieve', {layout: null});
});  // 用户密码重设

router.get('/password_retrieve', sign.retrievePassword);  // 用户密码重设

router.post('/password_retrieve', sign.editPassword);  // 用户密码重设

router.get('/password_reset/:uuid', sign.resetPassword);  // 用户密码重设

router.get('/signup', sign.showSignup);  // 跳转到注册页面

router.post('/signup', sign.signup);  // 提交注册信息

router.get('/getMailCode', sign.getMailCode);  // 获取邮件验证码

router.get('/logout', sign.logout);  // 登出

router.get('/login', sign.showLogin);  // 进入登录页面

router.post('/login', sign.login);  // 提交登录信息


router.get('/wechat/login', wechat.login);  // 微信登录
router.get('/wechat/callback', wechat.callback);  // 微信登录回调
router.get('/qq/login', qq.login);  // qq登录
router.get('/qq/callback', qq.callback);  // qq登录回调
router.get('/weibo/login', weibo.login);  // 微博登录
router.get('/weibo/callback', weibo.callback);  // 微博登录回调

//router.get('/pub/wxpay/makeQRcode/:productid', wxpay.makeQRcode);  // 微信支付二维码
//router.post('/pub/wxpay/callback', wxpay.callback);  // 微信支付
//router.post('/pub/wxpay/notify', wxpay.notify);  // 微信支付
//router.get('/pub/wxpay/order/:productid-:t1-:t2', wxpay.order);  // 微信购买接口（暂时不做）


//根据这两句生成uptoken
qiniu.conf.ACCESS_KEY = config.qn_access.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qn_access.SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.qn_access.Bucket_Name);

router.get('/uptoken', function (req, res) {
    var token = uptoken.token();
    res.json({
        uptoken: token
    });
})


/**
 *文章部分router
 */

router.get('/aticle', aticle.showAticleList) //文章列表
router.get('/a/:_id', aticle.showDetail) //文章正文
router.get('/create-aticle', aticle.showCreate)
router.post('/create-aticle', aticle.create)
router.get('/a/:_id/edit', aticle.showEdit);  // 显示编辑文章


/**
 *图集部分router
 */

router.get('/photo', photo.showPhotoList) //图片列表
router.get('/photo/:_id', photo.showDetail) //图片正文
router.get('/create-photo', photo.showCreate)
router.post('/create-photo', photo.publish)
router.get('/photo/:tid/edit', photo.showEdit);  // 编辑图片

// router.post('/topic/:tid/edit', auth.userRequired, topic.update);  //提交编辑


router.get('/video', video.showVideoList) //视频列表
router.get('/video/:_id', video.showDetail) //视频正文
router.get('/create-video', video.showCreate)
router.post('/create-video', video.publish)


//搜索

router.get('/search', search.search)


//用户中心
router.get('/ucenter', auth.validateLogin, ucenter.show);  // 用户中心
router.get('/tovip', auth.validateLogin, ucenter.showvip);  // 开通vip
router.post('/tovip', auth.validateLogin, ucenter.openvip);  // 开通vip
//验证登录
router.use('/uc', auth.validateLogin);
//账户安全
router.get('/uc/account', function (req, res) {
    res.render('uc_account');
});

//账户充值页
router.get('/uc/recharge', auth.validateLogin, function (req, res) {
    res.render('uc_recharge');
});

//账户充值
router.get('/uc/recharge/form', auth.ajaxValidateLogin, ucenter.rechargeForm);
//充值记录
router.get('/uc/recharge/list', auth.ajaxValidateLogin, ucenter.rechargeList);

//个人资料
router.get('/uc/view', function (req, res) {
    res.render('uc_view',
        {
            user: req.session.user,
            Domain: config.qn_access.Domain,
            Uptoken_Url: config.qn_access.Uptoken_Url
        }
    );
});


//个人主页
router.get('/userspace(/:id)?', ucenter.userspace);
router.get('/user/follow/:id/:type', ucenter.follow);


//修改密码
router.post('/uc/account/pwd', ucenter.pwd);
//修改个人资料
router.post('/uc/account/edit', ucenter.editInfo);
router.get('/uc/photo', ucenter.showPhotos);
router.get('/uc/money', ucenter.showMoney);

//评论
//添加
router.post('/comment/add', auth.ajaxValidateLogin, comment.add);
//加载列表
router.get('/comment/page', comment.page);
router.post('/comment/page', comment.page);

//首页图片列表
router.post('/home/photo/list', photo.findList);
//热门(popular) 最新(fresh) 编辑推荐(editors)
router.get('/photo/list/classify', photo.classify);
//推荐或取消
router.get('/photo/list/recommend', photo.recommend);

//========支付有关接口==============
//商品购买
router.get('/deal/photo/buy/:id', deal.buy);
//查看订单状态
router.get('/deal/order/:orderId', deal.get);
//生成订单信息
router.get('/deal/order/action/:productid-:t1-:t2', deal.handle);
//完成支付
router.get('/deal/order/pay/:orderId', deal.pay);
//微信异步通知支付结果
router.post('/pub/wxpay/notify', deal.notify);


//底部协议
router.use('/protocol', function (req, res) {
    res.render('protocol' + req.path);
});
module.exports = router;
