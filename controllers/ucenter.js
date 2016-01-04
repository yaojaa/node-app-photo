var config = require('../config');
var userProxy = require('../proxy/user.js');
var validator = require('validator');
var eventproxy = require('eventproxy');



//显示列表
exports.show = function(req, res) {

  res.render('ucenter',{
    score:100
  })
};

exports.showvip = function(req, res) {

   res.render('tovip')

};


exports.score=function(req, res) {

   res.render('score')

};




//开通VIP
exports.openvip = function(req, res) {

  var username=validator.trim(req.body.username);
  var expireDate= parseInt(req.body.expireDate);
console.log('expireDate',expireDate);
  var d=new Date();
 

  d.setDate(d.getDate()+expireDate); 

//日期月份没有+1
    var newDate=d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate();



    userProxy.getUserByName(username,function(err,oneuser){

    if(!oneuser){
      return 
    }

    if(oneuser.expire_date){

      console.log('你已经是VIP了。')
    }

    oneuser.expire_date=newDate;


    oneuser.save(function(err){
       if (err) {
        console.log('错误');
          return err;
        }
    console.log(oneuser.expire_date)

        console.log('开通成功！！！！！！');

          res.render('tovip',{
            success:'恭喜你开通成功！有效期至'+newDate
          })


    })
  })


};



