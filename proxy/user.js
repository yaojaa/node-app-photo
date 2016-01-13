var models  = require('../models');
var User    = models.User;
var uuid	= require('node-uuid');

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

exports.getUserByName = function (username, callback) {
  User.findOne({'user_name': username}, callback);
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

// Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);
//http://www.nodeclass.com/api/mongoose.html#guide_documents

exports.updateUser=function(id,query,callback){
  User.update({ _id: id }, query, callback);
}

exports.fillMoney=function(id,moneyNum,callback){
  User.update({ _id: id }, { $set:{ money: moneyNum }}, callback);
}


exports.pushHasBuy=function(id,photoID,callback){
  User.update({ _id: id }, { $push:{ hasBuy: photoID }}, callback);
}

exports.update = function (id, model, callback) {
  User.update({_id : id}, model, {multi: false}, callback);
};