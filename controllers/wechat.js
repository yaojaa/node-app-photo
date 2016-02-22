var crypto = require('crypto');
var request = require('request');
var User = require('../proxy/user');


var appid = 'wxbdc5610cc59c1631';
var secret = '';
var redirect_uri = 'https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do';

exports.login = function (req, res) {

  var state = generateState();
  req.session.wx_state = state;
  var url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login&state=' + state + '#wechat_redirect';
  res.redirect(url);
};

exports.callback = function (req, res) {

  var code = req.code;
  var state = req.state;
  var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code';

  if (!code) {
    console.log('用户禁止授权');
    return res.end('你禁止授权登录');
  }

  if (req.session.wx_state && req.session.wx_state !== state) {
    console.log('授权登录状态不一致');
    return res.end('授权登录状态不一致，登录被驳回');
  }

  request({url: url}, function (error, response, body) {
    if (!error) {
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

          if (!user) {//用户不存在，请求微信接口
            getWXUserInfo(result.access_token, result.openid, function (err, wxuser) {
              if (err) {
                return;
              }

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
              User.add(wxuser, function (err, model) {
                //登录成功
              });

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
  var url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid;
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