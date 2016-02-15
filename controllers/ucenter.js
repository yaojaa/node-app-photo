var config = require('../config');
var userProxy = require('../proxy/user.js');
var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy/user.js');
var crypto = require('crypto');
var Photo = require('../proxy/photo.js');
var Score = require('../proxy/score');
var Money = require('../proxy/money');
var moment = require('moment');

//显示列表
exports.show = function (req, res) {
  res.render('ucenter', {
    score: 100
  })
};

//编辑密码
exports.pwd = function (req, res) {

  var user = req.session.user;
  var md5 = crypto.createHash('md5'),
    oldword = md5.update(req.body.oldpwd).digest('hex');
  if (user.password !== oldword) {
    return res.fail('原密码错误');
  }
  var newpwd = crypto.createHash('md5').update(req.body.newpwd).digest('hex');
  User.update(user.id, {password: newpwd}, function (err, result) {
    if (err) return res.fail('修改密码失败');
    user.password = newpwd;
    res.ok();
  });
};

//编辑个人资料
exports.editInfo = function (req, res) {

  var user = req.session.user;
  User.update(user.id, req.body, function (err, result) {
    if (err) return res.fail('修改个人信息失败');
    user.nickname = req.body.nickname;
    user.cell_phone = req.body.cell_phone;
    user.wx = req.body.wx;
    user.QQ = req.body.QQ;
    user.avatar=req.body.avatar;
    user.signature = req.body.signature;
    res.ok();
  });
};

//展示个人图片
exports.showPhotos = function (req, res, next) {
  var q = {};
  var user = req.session.user;
  q.author_id = user.id;
  var pageNo = req.query.p ? parseInt(req.query.p) : 1;
  var list_photo_count = config.list_photo_count;
  var currentCategory = req.query.category;
  if (currentCategory && currentCategory !== 'all') {
    q.category = currentCategory;
  } else {
    currentCategory = 'all';
  }
  Photo.page(q, {pageNo: pageNo, sort: '-update_at'}, function (err, page) {
    if (err)return next(err);
    res.render('uc_photos', {
      category: config.category,
      currentCategory: currentCategory,
      page: pageNo,
      photos: page.list,
      prev: 'p=' + parseInt(pageNo - 1),
      next: 'p=' + parseInt(pageNo + 1),
      isFirstPage: pageNo === 1,
      isLastPage: pageNo === page.total,
      count: page.count
    })
  });

};

exports.showvip = function (req, res) {

  res.render('tovip')

};

//充值
exports.rechargeForm = function (req, res) {
  var money = validator.trim(req.query.money);
  var type = parseInt(req.query.type);
  if (!money) return res.render('uc_recharge_pay', {result: '请填写money'});
  if (type !== 0 && type !== 1)return res.render('uc_recharge_pay', {result: '请用支付宝或微信支付'});
  var model = {};
  model.money = money;
  model.type = type;
  model.userId = req.session.user.id;
  Money.save(model, function (err, result) {
    res.render('uc_recharge_pay', {result: '支付成功'});
  });

};

//充值记录
exports.rechargeList = function (req, res) {
  var userId = req.session.user.id;
  Money.page({userId: userId, errorno: 1}, {sort: '-create_at'}, function (err, page) {
      page.list.forEach(function (item) {
        item.createAt = moment(item.create_at).format('YYYY-MM-DD hh:mm:ss');
        if (item.type === 0) {
          item.pay = '支付宝';
        } else if (item.type === 1) {
          item.pay = '微信';
        } else {
          item.pay = '未知';
        }
      });
      res.render('uc_recharge_list', page);
    }
  )
  ;

}
;

//开通VIP
exports.openvip = function (req, res) {

  var username = validator.trim(req.body.username);
  var expireDate = parseInt(req.body.expireDate);
  console.log('expireDate', expireDate);
  var d = new Date();


  d.setDate(d.getDate() + expireDate);

//日期月份没有+1
  var newDate = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate();


  userProxy.getUserByName(username, function (err, oneuser) {

    if (!oneuser) {
      return
    }

    if (oneuser.expire_date) {

      console.log('你已经是VIP了。')
    }

    oneuser.expire_date = newDate;


    oneuser.save(function (err) {
      if (err) {
        console.log('错误');
        return err;
      }
      console.log(oneuser.expire_date)

      console.log('开通成功！！！！！！');

      res.render('tovip', {
        success: '恭喜你开通成功！有效期至' + newDate
      })


    })
  })


};



