var request = require('request');
var async = require('async');
var querystring = require('querystring');
var generator = require('../util/randomStatusGenerator');
//配置文件
var config = require('../config').qq;
var User = require('../proxy/user');
var makeSession = require('./sign').makeSession;

exports.login = function (req, res) {
  var state = generator.generate();
  req.session.qq_state = state;
  var url = config.authorizeURL + '?client_id=' + config.appid + '&redirect_uri=' + config.redirect_uri + '&response_type=code&scope=' + config.scope + '&state=' + state;
  res.redirect(url);
};

exports.callback = function (req, res) {
  var code = req.query.code;
  var state = req.query.state;
  var access_token = '';
  var openid = '';

  if (!code || !state || !req.session.qq_state || (req.session.wx_state !== state)) {
    console.log('[QQ]我们的网站被CSRF攻击了或者用户取消了授权');
    //return res.redirect('/login');
  } else {

    async.waterfall([function (callback) {
      console.log('step0:请求的code的值：', code);
      getAccessToken(code, callback);

    }, function (response, body, callback) {
      console.log('step1:获取access_token的返回值：', body);
      var result = querystring.parse(body);
      access_token = result.access_token;
      getOpenId(access_token, callback);

    }, function (response, body, callback) {
      console.log('step2:获取open_id的返回值：', body);
      var ret = /\"openid\"\s*:\s*\"(\w+)\"/.exec(body);
      if (ret) {
        openid = ret[1];
        console.log('step3:解析出来的openid', openid);
        callback(null, openid);
      } else {
        callback(new Error('server error'));
      }
    }, function (openid, callback) {

      User.getOpenid(openid, function (err, user) {
        if (err) {
          return callback(err);
        }
        console.log('QQ用户在数据库是否存在', user == null);
        if (!user) {//用户不存在，请求接口

          getUserInfo(access_token, openid, function (error, response, body) {
            if (error) {
              return callback(error);
            }

            var userInfo = JSON.parse(body);
            if (userInfo.ret == 0) {//用户信息成功获取
              user.openid = openid;
              user.nickname = userInfo.nickname;
              user.avatar = userInfo.figureurl_qq_2 || userInfo.figureurl_qq_1;
              if (userInfo.gender && userInfo.gender === '女') {
                user.sex = 2;
              } else {
                user.sex = 1;
              }
              user.qq_user = userInfo;
              callback(null, user);
            } else {
              callback(new Error('get userinfo fail'));
            }
          });

        } else {
          callback(null, user);
        }
      });

    }, function (user, callback) {
      console.log('step4:获取用户的返回值', user);
      if (!user._id) {//没有_id说明从qq获取的用户，将获取的用户存入数据库
        User.add(user, function (err, model) {
          callback(model);
        });
      } else {
        callback(user);
      }

    }], function (err, user) {
      if (err) {
        console.log('QQ登录会掉出错：', err.stack);
        return res.end('server error');
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
  var url = config.accessTokenURL + '?client_id=' + config.appid + '&client_secret=' + config.appkey + '&code=' + code + '&grant_type=authorization_code&redirect_uri=' + config.redirect_uri;
  request({url: url}, function (error, response, body) {
    callback(error, response, body);
  });
}

/**
 * 由access_token获取openid
 * @param access_token
 * @param callback
 */
function getOpenId(access_token, callback) {
  var url = config.getOpenIDURL + '?access_token=' + access_token;
  request({url: url}, function (error, response, body) {
    callback(error, response, body);
  });
}

/**
 * 由openid获取用户信息
 * @param access_token
 * @param openid
 * @param callback
 */
function getUserInfo(access_token, openid, callback) {
  var url = config.getUserInfoURL + '?access_token=' + access_token + '&openid=' + openid + '&oauth_consumer_key=' + config.appid;
  request({url: url}, function (error, response, body) {
    callback(error, response, body);
  });
}