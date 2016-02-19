var crypto = require('crypto');
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

  if (req.session.wx_state === state) {

  }

};

function generateState() {
  var key = 'fengying' + parseInt(Math.random() * 10000) + Date.now();
  var md5 = crypto.createHash('md5');
  md5.update(key);
  return md5.digest('hex')
}
