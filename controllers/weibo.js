var crypto = require('crypto');
var request = require('request');
var async = require('async');
var generator = require('../util/randomStatusGenerator');
//配置文件
var config = require('../config').weibo;
var User = require('../proxy/user');
var makeSession = require('./sign').makeSession;

exports.login = function (req, res) {
    var state = generator.generate();
    req.session.weibo_state = state;
    var url = config.qrconnectURL + '?client_id=' + config.appid + '&redirect_uri=' + config.redirect_uri + '&response_type=code&state=' + state;
    res.redirect(url);
};

exports.callback = function (req, res) {
    console.log('--------------->进入微博登录');
    var code = req.query.code;
    var state = req.query.state;
    var access_token = '';
    var openid = '';

    if (!code || !state || !req.session.weibo_state || (req.session.weibo_state !== state)) {
        console.log('[WX]我们的网站被CSRF攻击了或者用户取消了授权');
        return res.redirect('/login');
    } else {

        async.waterfall([function (callback) {
            console.log('step0:请求的code的值：', code);
            getAccessToken(code, callback);

        }, function (response, body, callback) {
            console.log('step1:获取access_token的返回值：', body);
            var result = JSON.parse(body);
            if (!result.access_token) {
                return callback(new Error('获取access_token信息失败'));
            }
            access_token = result.access_token;
            openid = result.uid;
            console.log('-------->access_token=', access_token, '----->openid=', openid);
            User.getOpenid(openid, callback);

        }, function (user, callback) {
            console.log('微博用户在数据库是否存在', user != null);
            if (!user) {//用户不存在，请求微信接口
                user = {};
                getUserInfo(access_token, openid, function (err, userInfo, body) {
                    if (err) {
                        return callback(err);
                    }
                    user.openid = userInfo.id;
                    user.nickname = userInfo.name;
                    user.avatar = userInfo.profile_image_url;
                    user.sex = userInfo.gender === 'm' ? 1 : userInfo.gender === 'f' ? 2 : 0;
                    user.profile = userInfo.description;
                    user.wb_url = userInfo.url;
                    user.wb_user = body;
                    callback(null, user);
                });
            } else {
                callback(null, user);
            }
        }, function (user, callback) {
            console.log('step4:获取用户的返回值', user);
            if (!user._id) {//没有_id说明从微信获取的用户，将获取的用户存入数据库
                User.add(user, callback);
            } else {
                callback(null, user);
            }

        }], function (err, user) {
            if (err) {
                console.log('微博登录出错：', err.stack);
                return res.redirect('/login');
            }
            makeSession(req, user, res);
            res.redirect('/');
        });
    }

};

/**
 * 由code获取access_token
 * @param access_token
 * @param callback
 */
function getAccessToken(code, callback) {
    var url = config.accessTokenURL + '?client_id=' + config.appid + '&client_secret=' + config.secret + '&code=' + code + '&grant_type=authorization_code&redirect_uri=' + config.redirect_uri;

    request.post({
        url: url,
        form: {
            client_id: config.appid,
            client_secret: config.secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: config.redirect_uri
        }
    }, function (err, response, body) {
        callback(err, response, body);
    });
}

function getUserInfo(access_token, openid, callback) {
    var url = config.getUserInfoURL + '?access_token=' + access_token + '&uid=' + openid;
    request({url: url}, function (error, response, body) {
        if (!error) {
            var result = JSON.parse(body);
            callback(null, result, body);
        } else {
            callback(error);
        }
    });
}