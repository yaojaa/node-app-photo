var config   = require('../config');
var User = require('../proxy/user.js');
var uuid = require('node-uuid');


//sign up
exports.showSignup = function(req, res) {
    res.render('user/signup')
};

exports.signup = function(req, res, next) {
    console.log('post........!!!!')
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

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

        User.newAndSave(password, email, false, function(err) {

            if (err) {
                return next(err);
            }

            res.render('user/signup', {
                success: '欢迎加入,恭喜你注册成功！账号：' + email + ' <a href="/login">立即登录</a>'
            });

        })



    })


}




exports.showLogin = function(req, res) {
    res.render('user/login');


}

exports.login = function(req, res, next) {
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    console.log(email)
    console.log(password)
    console.log(User.getUserByMail)


    if (!email || !password) {
          console.log('不能为空')

        res.status(422);
        return res.render('user/login', {
            error: '信息不完整。'
        });
    }

    User.getUserByMail(email, function(err, user) {

      console.log(user)
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

        if(password!==user.pass){

                return res.render('user/login', {
                error: '密码不正确！'
            });

            return next();
        }

        req.session.uid = user._id;
        res.redirect('/')

    })

}

exports.logout = function(req, res, next) {

   req.session.destroy();
   res.clearCookie(config.auth_cookie_name, { path: '/' });
   res.redirect('/');

}
