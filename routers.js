var express = require('express');
var sysRouter = require('./sys_routers');
var sign = require('./controllers/sign');
var aticle = require('./controllers/aticle');
var photo = require('./controllers/photo');
var video = require('./controllers/video');

var ucenter = require('./controllers/ucenter');
var auth = require('./middlewares/auth');


var config = require('./config')

var qiniu = require('qiniu');


var app = express();

var router = express.Router();


router.get('/', function (req, res) {
  res.render('home', {user: req.session.user})
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
router.get('/score', auth.validateLogin, ucenter.score);  // 积分充值
router.get('/tovip', auth.validateLogin, ucenter.showvip);  // 开通vip
router.post('/tovip', auth.validateLogin, ucenter.openvip);  // 开通vip
//验证登录
router.use('/uc',auth.validateLogin);
// 账户安全
router.get('/uc/account', function(req, res) {
  res.render('account');
});




module.exports = router;