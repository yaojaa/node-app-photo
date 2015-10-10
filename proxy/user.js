var models  = require('../models');
var User    = models.User;
var uuid    = require('node-uuid');


/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
  //  if (email.length === 0) {
  //   return callback(null, []);
  // }

  console.log('进入getUserByMail'+email)
  User.findOne({'email': email}, callback);
};

exports.newAndSave = function (password, email, active, callback) {
  var user         = new User();
  user.pass        = password;
  user.email       = email;
  user.avatar      = '';
  user.active      = active || false;
  user.accessToken = uuid.v4();
  user.save(callback);
};

