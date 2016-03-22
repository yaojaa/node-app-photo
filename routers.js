var express = require('express');
var sysRouter = require('./sys_routers');
var sign = require('./controllers/sign');
var aticle = require('./controllers/aticle');
var photo = require('./controllers/photo');
var video = require('./controllers/video');
var comment = require('./controllers/comment');
var wechat = require('./controllers/wechat');
var qq = require('./controllers/qq');
var wxpay = require('./controllers/wxpay');

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
})

router.get('/ranking', function (req, res) {
    res.render('ranking', {user: req.session.user})
})


//后台接口
router.use('/sys', sysRouter);


// var router = express.route;

// router('/').get(function(req,res){
//   console.log('aaaaaaaaaaaaaa')
//   res.render('home')
// })


router.get('/signup', sign.showSignup);  // 跳转到注册页面

router.post('/signup', sign.signup);  // 提交注册信息

router.get('/logout', sign.logout);  // 登出

router.get('/login', sign.showLogin);  // 进入登录页面

router.post('/login', sign.login);  // 提交登录信息


router.get('/wechat/login', wechat.login);  // 进入微信登录页面
router.get('/wechat/callback', wechat.callback);  // 进入微信登录页面
router.get('/qq/login', qq.login);  // 进入微信登录页面
router.get('/qq/callback', qq.callback);  // 进入微信登录页面

//router.get('/pub/wxpay/makeQRcode/:productid', wxpay.makeQRcode);  // 微信支付二维码
//router.post('/pub/wxpay/callback', wxpay.callback);  // 微信支付
router.post('/pub/wxpay/notify', wxpay.notify);  // 微信支付
router.get('/pub/wxpay/order/:productid-:t1-:t2', wxpay.order);  // 微信支付


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


router.get('/aticle', aticle.showAticleList) //文章列表
router.get('/a/:_id', aticle.showDetail) //文章正文
router.get('/create-aticle', aticle.showCreate)
router.post('/create-aticle', aticle.create)


router.get('/photo', photo.showPhotoList) //图片列表
router.get('/photo/:_id', photo.showDetail) //图片正文
router.get('/create-photo', photo.showCreate)
router.post('/create-photo', photo.publish)

router.get('/video', video.showVideoList) //视频列表
router.get('/video/:_id', video.showDetail) //视频正文
router.get('/create-video', video.showCreate)
router.post('/create-video', video.publish)

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


//修改密码
router.post('/uc/account/pwd', ucenter.pwd);
//修改个人资料
router.post('/uc/account/edit', ucenter.editInfo);
router.get('/uc/photo', ucenter.showPhotos);

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
module.exports = router;
