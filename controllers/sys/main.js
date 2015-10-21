var User  = require('../../proxy/sys/user');
var validator = require('validator');
var eventproxy = require('eventproxy');
var crypto = require('crypto');



//sign up
exports.login = function(req, res, next) {

  var body = req.body;
  var loginname = validator.trim(body.loginname);
  var password = validator.trim(body.password);
  if(!loginname){
    res.send({status:"001",msg:"login name is empty"});
    return;
  }
  if(!password){
    res.send({status:"001",msg:"password is empty"});
    return;
  }
  var md5 = crypto.createHash('md5'),
    password = md5.update(password).digest('hex');

  var user = {login_name:loginname,password:password};
  User.get(user,function(err,obj){
    if(err){
      return next(err);
    }
    if(!obj){
      res.send({status:"001",msg:"User name or password error"});
    } else {
      req.session.sysUser = obj;//用户信息存入 session
      res.send({status:"000",msg:"success"});
    }

  });
};

//sign out
exports.logout = function(req, res, next) {

  //清除session
  req.session.sysUser = null;
  //返回登录页
  res.redirect('/sys/login');
};

//添加新用户
exports.save = function(req, res, next) {

  var body = req.body;
  var loginname = validator.trim(body.loginname);
  var password = validator.trim(body.password);
  if(!loginname){
    res.send({status:"001",msg:"login name is empty"});
    return;
  }
  if(!password){
    res.send({status:"001",msg:"password is empty"});
    return;
  }
  if(password.length < 6){
    res.send({status:"001",msg:"The minimum password length is 6"});
    return;
  }
  var user = {loginname:loginname,password:password};
  User.save(user,function(err){
    if(err){
      return next(err);
    }
    res.send({status:"000",msg:"savesuccess"});
  });
};

exports.page = function(req, res, next){
  var body = req.body;
  var loginname = validator.trim(body.loginname);
  var pageNo = body.pageNo;
  var pageSize = body.pageSize;
  var where = {};
  if(loginname){
    where['login_name'] = {'$regex' : loginname};
  }
  var opt = {
    pageNo : pageNo,
    pageSize : pageSize
  };
  User.page(where,opt,function(err,obj){
    if(err){
      return next(err);
    }
    res.send({status:"000",msg:obj});
  });
};