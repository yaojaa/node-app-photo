var User = require('../../models').SysUser;
var crypto = require('crypto');
var async = require('async');


/**
 * 根据条件查询用户
 * @param {Function} callback 回调函数
 */
exports.get = function (model, callback) {
  User.findOne(model, callback);
};


/**
 * 根据Id更新
 * @param {Function} callback 回调函数
 */
exports.update = function (id, model, callback) {
  User.update({_id : id}, model, {multi: false}, callback);
};

/**
 * 根据Id更新
 * @param {Function} callback 回调函数
 */
exports.del = function (id, callback) {
  User.remove({_id : id}, callback);
};

/**
 * 分页查询
 * @param query 查询条件
 * @param opt 排序，分页如{pageNo: 1，pageSize: 10, sort: '-create_at'}
 * @param callback
 */
exports.page = function (query, opt, callback) {
  var pageNo = opt.pageNo || 1;
  var pageSize = opt.pageSize || 10;
  pageNo--;
  async.parallel([
    function (callback) {
      var skip = pageNo * pageSize;
      var limit = pageSize;
      opt.skip = skip;
      opt.limit = limit;
      User.find(query, {}, opt, callback);
    },
    function (callback) {
      User.count(query, callback);
    }
  ], function (err, result) {
    if (err) {
      callback(err);
      return;
    }

    var list = result[0];
    var count = result[1];//总记录数
    var total = Math.ceil(count/pageSize);//总页数
    callback(null,{list:list,count:count,total:total});
  });

};

/**
 * 创建一个管理员用户
 * @param model
 * @param callback
 */
exports.save = function (model, callback) {
  var md5 = crypto.createHash('md5'),
    password = md5.update(model.password).digest('hex');
  var user = new User();
  user.login_name = model.loginname;
  user.password = password;
  user.create_id = model.createId;
  user.save(callback);
};

