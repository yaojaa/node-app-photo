var config = require('../config');
var models = require('../models');
var MoneyLog = models.MoneyLog;
var async = require('async');

var list_photo_count = config.list_photo_count;

//保存
exports.save = function (model, callback) {
  MoneyLog.create(model, callback);
};

/**
 * 分页查询
 * @param query 查询条件
 * @param opt 排序，分页如{pageNo: 1，pageSize: 10, sort: '-create_at'}
 * @param callback
 */
exports.page = function (query, opt, callback) {
  var pageNo = opt.pageNo || 1;
  var pageSize = opt.pageSize || list_photo_count;
  pageNo--;
  async.parallel([
    function (callback) {
      var skip = pageNo * pageSize;
      var limit = pageSize;
      opt.skip = skip;
      opt.limit = limit;
      MoneyLog.find(query, {}, opt, callback);
    },
    function (callback) {
      MoneyLog.count(query, callback);
    }
  ], function (err, result) {
    if (err) {
      callback(err);
      return;
    }

    var list = result[0];
    var count = result[1];//总记录数
    var total = Math.ceil(count / pageSize);//总页数
    callback(null, {list: list, count: count, total: total});
  });

};