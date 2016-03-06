var User = require('../../proxy/user');
var validator = require('validator');
var moment = require('moment');

exports.page = function (req, res, next) {
  var body = req.body;
  var nickname = validator.trim(body.nickname);
  var email = validator.trim(body.email);
  var pageNo = body.pageNo;
  var pageSize = body.pageSize;
  var where = {};
  if (nickname) {
    where['nickname'] = {'$regex': nickname};
  }
  if (email) {
    where['email'] = {'$regex': email};
  }
  var opt = {
    pageNo: pageNo,
    pageSize: pageSize,
    sort: '-create_at'
  };
  User.page(where, {}, opt, function (err, obj) {
    if (err) {
      res.send({status: "001", msg: err.message});
      return;
    }
    obj.list = obj.list.map(function (item) {
      var sex = item.sex;
      var source = '网站';
      if (item.sex) {
        sex = item.sex === 1 ? '男' : '女';
      }

      if (item.openid) {
        if (item.qq_user) {
          source = 'QQ';
        }
        if (item.wx_user) {
          source = '微信';
        }
      }
      return {
        nickname: item.nickname,
        email: item.email,
        create_at: moment(item.create_at).format('YYYY-MM-DD HH:mm:ss'),
        cell_phone: item.cell_phone,
        wx: item.wx,
        QQ: item.QQ,
        signature: item.signature,
        sex: sex,
        avatar: item.avatar,
        source: source
      };
    });
    res.send({status: "000", msg: obj});
  });
};

exports.detail = function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return next(new Error('请选择一个用户'));
  }

  User.getUserID(id, function (err, userinfo) {
    if (err) {
      console.error('[sys][user][detail]' + 查询用户信息失败);
      return next(new Error('请选择一个用户'));
    }
    var user = req.session.sysUser;
    res.render('sys/user_detail', {
      layout : 'admin',
      loginname : user['login_name'],
      userinfo : userinfo
    });

  });
};