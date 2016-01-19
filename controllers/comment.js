var config = require('../config');
var Comment = require('../proxy/comment');


//添加评论
exports.add = function (req, res) {
  var model = req.body;
  if (!model.belongId || !model.content) {
    return res.fail('字段缺失');
  }
  model.userId = req.session.user.id;
  Comment.add(model, function (err, ret) {
    if (err) {
      return res.fail();
    }
    res.ok();
  });
};

//加载评论
exports.page = function (req, res) {
  var belongId = req.param('belongId');
  var pageNo = req.param('pageNo');
  if (!belongId) {
    return res.fail('请选择评论所属Id');
  }
  Comment.page({belongId: belongId}, {pageNo: pageNo, sort: 'create_at'}, function (err, ret) {
    if (err) {
      return res.fail();
    }
    res.ok(ret);
  });
};

