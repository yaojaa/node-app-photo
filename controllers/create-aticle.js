var config = require('../config');
var Aticle = require('../proxy/aticle.js');
var validator = require('validator');
var eventproxy = require('eventproxy');


//进入发布页
exports.show = function(req, res) {
    res.render('create-aticle')
};


exports.create = function(req, res) {

   var title = validator.trim(req.body.title);
   var content = validator.trim(req.body.content);
   var authorId=req.session.user._id || '000';

   console.log(title,content,authorId);

   Aticle.newAndSave(title, content, authorId, function(err){

       if (err) {
        return next(err);
              }
    res.render('create-aticle',{success:'发布成功！'});


   })

};



