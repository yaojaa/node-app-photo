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
      res.send({status:"001",msg:err.message});
      return;
    }
    if(!obj){
      res.send({status:"001",msg:"User name or password error"});
    } else if(obj.status != 1){
      res.send({status:"001",msg:"User is invalid"});
    } else{

      var options = {
        "login_count" : obj['login_count'] + 1,
        "last_login_time" : obj['login_time'],
        "login_time" : new Date()
      };

      User.update(obj._id,options,function(err){
        if(err){
          res.send({status:"001",msg:err.message});
          return;
        }

        req.session.sysUser = obj;//用户信息存入 session
        res.send({status:"000",msg:"success"});
      });

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
  if(!loginname){
    res.send({status:"001",msg:"login name is empty"});
    return;
  }
  //密码默认111111
  var user = {loginname:loginname,password:'111111'};

  User.get({login_name:loginname},function(err,obj){
    if(err){
      res.send({status:"001",msg:err.message});
      return;
    }
    if(obj){
      res.send({status:"001",msg:"User name already exists"});
    } else {
      User.save(user,function(err){
        if(err){
          res.send({status:"001",msg:err.message});
          return;
        }
        res.send({status:"000",msg:"savesuccess"});
      });
    }

  });

};


//修改密码
exports.repwd = function(req, res, next) {
  var body = req.body;
  var oldpassword = validator.trim(body.oldpassword);
  var password = validator.trim(body.password);

  var user = req.session.sysUser;

  oldpassword = crypto.createHash('md5').update(oldpassword).digest('hex');

  if(oldpassword != user.password){
    res.send({status:"001",msg:"password is wrong"});
    return;
  }

  password = crypto.createHash('md5').update(password).digest('hex');
  User.update(user._id,{password : password},function(err){
    if(err){
      res.send({status:"001",msg:err.message});
      return;
    }

    req.session.sysUser.password = password;
    res.send({status:"000",msg:"success"});
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
      res.send({status:"001",msg:err.message});
      return;
    }
    res.send({status:"000",msg:obj});
  });
};