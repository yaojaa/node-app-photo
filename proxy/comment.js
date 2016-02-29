var config = require('../config');
var models = require('../models');
var Comment = models.Comment;
var User = models.User;
var async = require('async');

exports.add = function (model, callback) {
  Comment.create(model, function (err, model) {
      if (err) {
        console.error('添加评论出错：', err.stack);
        return callback(err);
      }
      callback(err, model);
    }
  );
};

/**
 * 分页查询
 * @param query 查询条件
 * @param opt 排序，分页如{pageNo: 1，pageSize: 10, sort: '-create_at'}
 * @param callback
 */
exports.page = function (query, opt, callback) {
  var pageNo = opt.pageNo || 1;
  var pageSize = opt.pageSize || 15;
  pageNo--;
  async.parallel([
    function (callback) {
      var skip = pageNo * pageSize;
      var limit = pageSize;
      opt.skip = skip;
      opt.limit = limit;
      Comment.find(query, {}, opt, callback);
    },
    function (callback) {
      Comment.count(query, callback);
    }
  ], function (err, result) {
    if (err) {
      return callback(err);
    }

    var list = result[0];
    var count = result[1];//总记录数
    var total = Math.ceil(count / pageSize);//总页数

    if (list.length == 0) {
      return callback(null, {list: list, count: count, total: total});
    }

    var ids = [];
    list.forEach(function (item) {
      if (item.replyId) {
        ids.push(item.userId, item.replyId);
      } else {
        ids.push(item.userId);
      }
    });

    User.find({'_id': {'$in': ids}}, {}, function (err, users) {
      if (err) {
        return callback(err);
      }

      list = list.map(function (item) {
        var cnt = 1;
        if (item.replyId) {
          cnt = 0;
        }

        for (var i = 0, len = users.length; i < len; i++) {
          var user = users[i];
          var userName = user.nickname || user.user_name || user.email;
          if (item.userId == user._id) {
            item.userName = userName;
            item.userAvatar = user.avatar;
            cnt++;
          } else if (item.replyId == user._id) {
            item.replyName = userName;
            item.replyAvatar = user.avatar;
            cnt++;
          }
          if (cnt >= 2) break;
        }

        return {
          id: item._id,
          belongId: item.userId,
          content: item.content,
          createAt: item.create_at,
          userId: item.userId,
          userName: item.userName,
          userAvatar: item.userAvatar,
          replyId: item.replyId,
          replyName: item.replyName,
          replyAvatar: item.replyAvatar
        };

      });

      callback(null, {list: list, count: count, total: total});
    });

  });

};