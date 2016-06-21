var config = require('../config');
var models = require('../models');
var Order = models.Order;
var async = require('async');

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
    Order.findOne({_id: id}, callback);
};

/**
 * 分页查询
 * @param query 查询条件
 * @param keys 查询的字段
 * @param opt 排序，分页如{pageNo: 1，pageSize: 10, sort: '-create_at'}
 * @param callback
 */
exports.page = function (query, keys, opt, callback) {
    var pageNo = opt.pageNo || 1;
    var pageSize = opt.pageSize || 10;
    pageNo--;
    async.parallel({
          one: function (callback) {
              var skip = pageNo * pageSize;
              var limit = pageSize;

              opt.skip = skip;
              opt.limit = limit;
              Order.find(query, keys, opt, callback);
          },
          two: function (callback) {
              Order.count(query, callback);
          }
      },
      function (err, results) {
          var list = results.one;
          var count = results.two;//总记录数
          var total = Math.ceil(count / pageSize);//总页数
          callback(null, {list: list, count: count, total: total});

      });
};