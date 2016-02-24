var crypto = require('crypto');
var request = require('request');
var generator = require('../util/randomStatusGenerator');
//配置文件
var config = require('../config').wx;
var User = require('../proxy/user');
var makeSession = require('./sign').makeSession;

exports.login = function (req, res) {
  var state = generator.generate();
  req.session.wx_state = state;
  var url = config.qrconnectURL + '?appid=' + config.appid + '&redirect_uri=' + config.redirect_uri + '&response_type=code&scope=' + config.scope + '&state=' + state + '#wechat_redirect';
  res.redirect(url);
};

exports.callback = function (req, res) {

  var code = req.code;
  var state = req.state;
  var url = '?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code';

  if (!code) {
    console.log('WX用户禁止授权');
    return res.redirect('/login');
  }

  if (req.session.wx_state && req.session.wx_state !== state) {
    console.log('WX授权登录状态不一致，登录被驳回');
    return res.redirect('/login');
  }
  console.log('WX请求access_token的url地址', url);
  request({url: url}, function (error, response, body) {
    if (!error) {
      console.log('请求access_token的结果', body);
      var result = JSON.parse(body);
      if (!result.errcode) {
        //接口调用凭证
        result.access_token;
        //access_token接口调用凭证超时时间，单位（秒）
        result.expires_in;
        //用户刷新access_token
        result.refresh_token;
        //授权用户唯一标识
        result.openid;
        //用户授权的作用域，使用逗号（,）分隔
        result.scope;

        User.getOpenid(result.openid, function (err, user) {
          if (err) {
            return;
          }
          console.log('微信用户在数据库是否存在', user == null);
          if (!user) {//用户不存在，请求微信接口
            getWXUserInfo(result.access_token, result.openid, function (err, wxuser) {
              if (err) {
                return;
              }
              console.log('微信用户信息', wxuser);
              wxuser.openid;
              wxuser.nickname;
              wxuser.sex;
              wxuser.province;
              wxuser.city;
              wxuser.country;
              wxuser.headimgurl;
              wxuser.privilege;
              wxuser.unionid;

              //保存用户信息
              //User.add(wxuser, function (err, model) {
              //登录成功
              //});

            });

          } else {
            //登录成功
          }


        });

      } else {
        console.log('获取access_token失效:', result.errmsg);
      }
    }
  });
};

function generateState() {
  var key = 'fengying' + parseInt(Math.random() * 10000) + Date.now();
  var md5 = crypto.createHash('md5');
  md5.update(key);
  return md5.digest('hex')
}


function getWXUserInfo(access_token, openid, callback) {
  var url = '?access_token=' + access_token + '&openid=' + openid;
  request({url: url}, function (error, response, body) {
    if (!error) {
      var result = JSON.parse(body);
      if (!result.errcode) {
        callback(null, result);
      } else {
        callback(new Error(result.errmsg));
        console.log('获取userinfo失败:', result.errmsg);
      }
    } else {
      callback(error);
    }
  });
}