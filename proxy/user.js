var models = require('../models');
var User = models.User;
var uuid = require('node-uuid');
var config = require('../config');

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

exports.getUserID = function (id, callback) {
  User.findOne({'_id': id}, callback);
};


exports.findByIds = function (ids, callback) {
  User.find({'_id': {'$in': ids}}, callback);
};

//根据微信唯一标示查找用户
exports.getOpenid = function (openid, callback) {
  User.findOne({'openid': openid}, callback);
};

exports.newAndSave = function (password, email, nickname, active, callback) {
  var user = new User();
  user.password = password;
  user.email = email;
  user.nickname = nickname;
  user.avatar = config.avatar;
  user.active = active || false;
  user.accessToken = uuid.v4();
  user.save(callback);
};

//添加新用户
exports.add = function (model, callback) {
  User.create(model, function (err, model) {
      if (err) {
        console.error('添加新用户：', err.stack);
        return callback(err);
      }
      callback(err, model);
    }
  );
};

// Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);
//http://www.nodeclass.com/api/mongoose.html#guide_documents

exports.updateUser = function (id, query, callback) {
  User.update({_id: id}, query, callback);
}

exports.fillMoney = function (id, moneyNum, callback) {
  User.update({_id: id}, {$set: {money: moneyNum}}, callback);
}


exports.pushHasBuy = function (id, photoID, callback) {
  User.update({_id: id}, {$push: {hasBuy: photoID}}, callback);
}

exports.update = function (id, model, callback) {
  User.update({_id: id}, model, {multi: false}, callback);
};