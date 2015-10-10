var express = require('express');
var sign = require('./controllers/sign');

var app = express();

var router = express.Router();


router.get('/', function (req, res) {
 res.render('home',{user:res.locals.user})
})

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


module.exports = router;
