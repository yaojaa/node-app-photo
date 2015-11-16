var config = require('../config');
var User = require('../proxy/user.js');
var validator = require('validator');
var eventproxy = require('eventproxy');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var session = require('express-session');



//sign up
exports.showSignup = function(req, res) {
    res.render('user/signup')
};


//注册
exports.signup = function(req, res, next) {
    var email = validator.trim(req.body.email.toLowerCase());
    var password = validator.trim(req.body.password);
    var loginname = validator.trim(req.body.username);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.status(422);
    res.render('user/signup', {error: msg, loginname: loginname, email: email});
  });


   // 验证信息的正确性

  if ([loginname, password, email].some(function (item) { return item === ''; })) {
    ep.emit('prop_err', '信息不完整。');
    return;
  }

  if (loginname.length < 5) {
    ep.emit('prop_err', '用户名至少需要5个字符。');
    return;
  }
  if (password.length < 6) {
    ep.emit('prop_err', '密码至少需要6个字符。');
    return;
  }
  if (!validator.isEmail(email)) {
    ep.emit('prop_err', '邮箱不合法。');
     return
  }


  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(password).digest('hex');

      console.log(password, email,loginname);


  User.getUserByMail(email, function(err, users) {

        if (err) {
            return next(err);
        }
        if (!!users) {
            res.render('user/signup', {
                error: '邮箱已被使用。'
            });
            return next();
        }

        User.newAndSave(password, email,loginname,false, function(err) {

            if (err) {
                return next(err);
            }
            req.session.user = user;//用户信息存入 session
            res.render('user/login', {
                success: '欢迎加入,恭喜你注册成功！账号：' + email 
            });

        })



    })


}




exports.showLogin = function(req, res) {
    res.render('user/login');


}


//登录
exports.login = function(req, res, next) {
    var email = validator.trim(req.body.email.toLowerCase());
    var password = validator.trim(req.body.password);


    if (!email || !password) {
        res.status(422);
        return res.render('user/login', {
            error: '信息不完整。'
        });
    }

      //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(password).digest('hex');

              console.log('输入的密码加密后:'+password)


    User.getUserByMail(email, function(err, user) {
        if (err) {
            return res.render('user/login', {
                error: '数据库错误'
            });
        }

        if (!user) {
            return res.render('user/login', {
                error: '用户不存在'
            });
            return next();
        }

        if (password !== user.password) {
            return res.render('user/login', {
                error: '密码不正确！'
            });
            return next();
        }

        req.session.user=user;

        function gen_session(user, res) {
              var auth_token = user.user_name + '$$$$'+ user.password; // 以后可能会存储更多信息，用 $$$$ 来分隔
              var opts = {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                signed: true,
                httpOnly: true
              };
              res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
            }

       gen_session(user, res);

        res.redirect('/')


    })

}

exports.logout = function(req, res, next) {

    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    res.redirect('/');

}
