var config = require('../../config');
var userProxy = require('../../proxy/user.js');

//获取用户信息

exports.getUserInfoById=function(req, res){

    var id=req.body.id;

    


}


//开通VIP
exports.tovip = function(req, res) {

  var userEmail=req.session.user;
  var expireDate= parseInt(req.body.expireDate);
  var needMoney = req.body.needMoney;

  console.log(userEmail,expireDate,needMoney)


  // d.setDate(d.getDate()+expireDate); 

  //  //日期月份没有+1
  //   var newDate=d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate();

  //   userProxy.getUserByName(username,function(err,oneuser){

  //   if(!oneuser){
  //     return 
  //   }

  //   if(oneuser.expire_date){

  //     console.log('你已经是VIP了。')
  //   }

  //   oneuser.expire_date=newDate;


  //   oneuser.save(function(err){
  //      if (err) {
  //       console.log('错误');
  //         return err;
  //       }
  //   console.log(oneuser.expire_date)

  //       console.log('开通成功！！！！！！');

  //         res.send({
  //           success:'恭喜你开通成功！有效期至'+newDate
  //         })


  //   })
  // })


};



