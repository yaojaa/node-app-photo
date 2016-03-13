var config = require('../config');
var models = require('../models');
var Order = models.Order;

//添加新订单
exports.add = function (model, callback) {
  Order.create(model, function (err, model) {
    if (err) {
      console.error('添加新订单：', err.stack);
      return callback(err);
    }
    callback(null, model);
  });
};

exports.update = function (id, model, callback) {
  Order.update({_id: id}, model, {multi: false}, callback);
};

exports.getOrderById = function (id, callback) {
  Order.findOne({'_id': id}, callback);
};