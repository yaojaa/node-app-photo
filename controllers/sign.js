var config = require('../config');
var User = require('../proxy/user.js');
var validator = require('validator');
var eventproxy = require('eventproxy');
var crypto = require('crypto');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var emailService = require('../service').emailService;

//本地缓存，用于存储密码找回账号
var cache = {};

//sign up
exports.showSignup = function (req, res) {
    res.render('user/signup', {layout: null});
};

// 找回密码
// 规则：每帐号每天只能使用三次
//      一个url只能修改一次密码,
//      当同一帐号发送多封邮件,只有最后一封邮件的url有效
//      每个url的有效性是12小时
//      每个url使用后即失效
exports.retrievePassword = function (req, res) {
    var email = req.query.email;
    if (!validator.isEmail(email)) {
        return res.fail('邮件格式不正确');
    }
    email = email.toLowerCase();
    var emailCache = cache[email];

    var ep = new eventproxy();
    ep.fail(function () {
        res.fail('服务失败');
    });
    ep.on('send_email', function () {
        cache[email] = emailCache;
        var url = 'http://www.fengimage.com/password_reset/' + emailCache.uuid;
        emailService.retrievePassword(url, email, function (err, info) {
            console.log('发送邮件', err, info);
            if (err) {
                res.fail('邮件发送失败');
            } else {
                //发送次数加一
                emailCache.count++;
                res.ok();
            }
        });
    });

    if (!emailCache) {
        User.getUserByMail(email, function (err, user) {
            if (err) {
                return res.fail('服务失败');
            }
            if (!user) {
                return res.fail('该邮箱还未注册');
            }

            emailCache = {
                _id: user._id,
                uuid: uuid.v4(),
                timestamp: Date.now(),
                count: 1
            };

            ep.emit('send_email', emailCache);

        });
    } else {
        if (Date.now() - emailCache.timestamp > 1000 * 60 * 60 * 12) {
            emailCache = {
                timestamp: Date.now(),
                count: 1
            };
        }
        if (emailCache.count > 3) {
            return res.fail('一天只能找回3次密码');
        }
        emailCache.uuid = uuid.v4();
        ep.emit('send_email', emailCache);
    }

};

//重新设置密码
exports.resetPassword = function (req, res) {
    var uuid = req.params.uuid;
    if (!uuid) {
        return res.render('user/sign_error', {layout: null, message: '链接地址错误'});
    }
    for (var key in cache) {
        if (cache[key].uuid === uuid) {
            cache[key].uuid = null;
            req.session.user_id = cache[key]['_id'];
            return res.render('user/password_reset', {layout: null, email: key, uuid: uuid});
        }
    }

    res.render('user/sign_error', {layout: null, message: '链接地址已经失效，请重新获取'});
};

//重新设置密码
exports.editPassword = function (req, res) {
    var uuid = req.body.uuid;
    var password = req.body.password.trim();
    var user_id = req.session.user_id;
    console.log('重置密码', password, user_id);
    if (!user_id) {
        return res.fail('会话已经失效，请刷新页面');
    }

    if (password.length < 6) {
        return res.fail('密码最少6个字符');
    }

    var newpwd = crypto.createHash('md5').update(password).digest('hex');
    User.update(user_id, {password: newpwd}, function (err, result) {
        if (err) return res.fail('修改密码失败');
        req.session.user_id = null;
        res.ok();
    });

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
