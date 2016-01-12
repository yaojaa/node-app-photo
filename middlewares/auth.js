var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var config = require('../config');

var UserProxy = require('../proxy').User;


/**
 * 需要管理员权限  只对接口形式有效 返回json
 */
exports.adminRequired = function (req, res, next) {

  console.log(req.session.user)

  if (!req.session.user) {
    return res.send({errorno: -1, msg: '没有登录'})
  }

  if (!req.session.user.is_admin) {
    return res.send({errorno: -1, msg: '没有权限'})
  }
  next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({errorno:-1,msg:'未登录'});
  }

  next();
};

/**
 * 需要VIP
 */

exports.vipUser = function () {
  return function (req, res, next) {

    if (!req.session.user.is_vip) {
      return res.status(403).send('你还不是VIP，请升级VIP');
    }
    next();
  };
};


// 验证用户是否登录
exports.validateLogin = function (req, res, next) {
  if (!req.session || !req.session.user) {
    res.redirect('/login?service=' + encodeURIComponent(req.originalUrl));
  } else {
    next();
  }

};