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
  User.findOne({'email': email}, callback);
};

exports.newAndSave = function (password, email, username,active, callback) {
  var user         = new User();
  user.password    = password;
  user.email       = email;
  user.user_name    = username;
  user.avatar      = '';
  user.active      = active || false;
  user.accessToken = uuid.v4();
  user.save(callback);
};

