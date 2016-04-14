var config = require('../config');
var User = require('../proxy/user.js');
var validator = require('validator');
var eventproxy = require('eventproxy');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var emailService = require('../service').emailService;


//sign up
exports.showSignup = function (req, res) {
    res.render('user/signup', {layout: null});
};


//获取验证码
exports.getMailCode = function (req, res) {
    var email = req.query.email;
    if (!validator.isEmail(email)) {
        return res.fail('邮件格式不正确');
    }

    var codeInfo = req.session.code_info;
    if (codeInfo) {
        if (codeInfo.email && codeInfo.email === email) {
            if (Date.now() - codeInfo.timestamp <= 1000 * 30) {
                return res.fail('每次发邮件的间隔时间为30秒，请等待');
            }
        }
    }


    var seed = '1234567890abcdefghijkmnpqrstuvwxyz';
    var i = 0;
    var code = '';
    while (i < 6) {
        code += seed.charAt(Math.floor(Math.random() * seed.length))
        i++;
    }
    req.session.code_info = {
        email: email,
        code: code,
        timestamp: Date.now()
    };
    emailService.sendCodeMail(code, email, function (err, info) {
        console.log('发送邮件', err, info);
        if (err) {
            res.fail('邮件发送失败');
        } else {
            res.ok();
        }
    });
};

//注册
exports.signup = function (req, res, next) {
    var email = validator.trim(req.body.email.toLowerCase());
    var password = validator.trim(req.body.password);
    var nickname = validator.trim(req.body.nickname);
    var code = validator.trim(req.body.code);
    var reg_protocol = validator.trim(req.body.reg_protocol);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        res.fail(msg);
    });


    if (reg_protocol != 1) {
        return ep.emit('prop_err', '请勾选用户协议');
    }

    // 验证信息的正确性
    if ([nickname, password, email].some(function (item) {
            return item === '';
        })) {
        ep.emit('prop_err', '信息不完整。');
        return;
    }

    if (nickname.length < 2) {
        ep.emit('prop_err', '用户名至少需要2个字符。');
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

    //验证邮箱
    var codeInfo = req.session.code_info;
    console.log(codeInfo);
    if (codeInfo) {
        if (codeInfo.email !== email) {
            return ep.emit('prop_err', '请先发送验证码验证邮箱。');
        } else {
            if (Date.now() - codeInfo.timestamp > 1000 * 10 * 50) {
                req.session.code_info = null;
                return ep.emit('prop_err', '验证码已经失效请重新发送');
            } else {
                if (codeInfo.code !== code) {
                    return ep.emit('prop_err', '验证码错误，请重新输入');
                }
            }
        }
    } else {
        return ep.emit('prop_err', '请发送验证码。');
    }


    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(password).digest('hex');
    User.getUserByMail(email, function (err, users) {

        if (err) {
            console.log('[sign]注册用户失败', err.stack);
            return ep.emit('prop_err', '注册用户失败');
        }
        if (!!users) {
            return ep.emit('prop_err', '邮箱已被使用');
        }

        User.newAndSave(password, email, nickname, false, function (err) {

            if (err) {
                return next(err);
            }
            // req.session.user = user;//用户信息存入 session
            res.ok('欢迎加入,恭喜你注册成功！账号：' + email);

        });


    });


}


exports.showLogin = function (req, res) {
    req.session._loginReferer = req.headers.referer;
    res.render('user/login', {
        layout: null,
        service: req.query.service || ''
    });
}

exports.makeSession = makeSession;

function makeSession(req, user, res) {
    req.session.user = {
        username: user.nickname,
        password: user.password,
        email: user.email,
        avatar: user.avatar,
        id: user._id,
        score: user.score,
        money: user.money,
        is_vip: user.is_vip,
        is_admin: config.admins.hasOwnProperty(user.email),
        signature: user.signature,
        nickname: user.nickname,
        cell_phone: user.cell_phone,
        hasBuy: user.hasBuy,
        wx: user.wx,
        QQ: user.QQ
    };

    var auth_token = user.email + '$$$$' + user.password; // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天


}


//检查登录，自动登录
function checkIsLogin(req, res, next) {


    if (req.session.user) {
        return next(); //若有session，直接跳过此中间件
    } else {

        var cookie = req.signedCookies[config.auth_cookie_name]; //读cookie，通过配置文件中标识符读cookie
        if (!cookie) {
            return next(); //若没有此站点的cookie，直接跳过此中间件
        }

        //?????拿到cookie后应该到服务器端验证！！这里暂时未做验证！！！
        var auth = cookie.split('$$$$');
        var email = auth[0],
            password = auth[1]; //解密后拿到username与password


        User.getUserByMail(email, function (err, user) {


            if (err) {
                return next();
            }

            if (!user) {

                return next();
            }

            if (password !== user.password) {

                return next();
            }

            makeSession(req, user, res)


            return next(); //进行下一步

        })
    }

}

exports.checkIsLogin = checkIsLogin;


var notJump = [
    '/reset_pass',     //reset password page, avoid to reset twice
    '/signup'       //regist page
];


//登录
exports.login = function (req, res, next) {
    var email = validator.trim(req.body.email.toLowerCase());
    var password = validator.trim(req.body.password);

    //来路
    var refer = req.session._loginReferer || '/';

    console.log(req.session._loginReferer)


    if (!email || !password) {
        return res.fail('用户名或密码不正确');
    }

    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(password).digest('hex');

    User.getUserByMail(email, function (err, user) {
        if (err) {
            console.log('[login]', err.stack);
            return res.fail('系统错误，稍后重试');
        }

        if (!user) {
            return res.fail('用户不存在');
        }

        if (password !== user.password) {
            return res.fail('密码不正确');
        }

        makeSession(req, user, res);

        res.ok('登录成功');
        //for (var i = 0, len = notJump.length; i !== len; ++i) {
        //    if (refer.indexOf(notJump[i]) >= 0) {
        //        refer = '/';
        //        break;
        //    }
        //}
        //
        //res.redirect(refer);
    });

}

exports.logout = function (req, res, next) {

    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    res.redirect('/');

}
