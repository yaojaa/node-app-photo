var express = require('express');
var sysRouter = require('./sys_routers');
var sign = require('./controllers/sign');
var aticle = require('./controllers/aticle');


var app = express();

var router = express.Router();


router.get('/', function (req, res) {
 res.render('home',{user:req.session.user})
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


router.get('/photo', function (req, res) {
 res.render('photo')
})

router.get('/video', function (req, res) {
 res.render('video')
})


router.get('/aticle', aticle.showAticleList) //文章列表


router.get('/a/:_id', aticle.showDetail) //文章正文


router.get('/create-aticle', aticle.showCreate)

router.post('/create-aticle', aticle.create)
module.exports = router;