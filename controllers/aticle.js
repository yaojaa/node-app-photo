var config = require('../config');
var Aticle = require('../proxy/aticle.js');
var validator = require('validator');
var eventproxy = require('eventproxy');


//findOnePage
exports.showAticleList = function(req, res) {

    var page = req.query.p ? parseInt(req.query.p) : 1;

  Aticle.findOnePage(page,function(err,lists,count){

     if (err) {
        return next(err);
              }

  res.render('aticle',{
    page:page,
    aticles:lists,
    prev:'p='+parseInt(page-1),
    next:'p='+parseInt(page+1),
    count:count})


  })
};

exports.showCreate=function(req, res){

  res.render('create-aticle')

}

exports.create = function(req, res) {

   var title = validator.trim(req.body.title);
   var content = validator.trim(req.body.content);
   var authorId=req.session.user._id || '000';

   Aticle.newAndSave(title, content, authorId, function(err){

       if (err) {
        return next(err);
              }
    res.render('create-aticle',{success:'发布成功！'});

   })

};


exports.showDetail=function(req, res){
   var _id=req.params._id;
   Aticle.findOneAticle(_id,function(err,doc){

      res.render('aticle-view',{
        aticle:doc
  })


   })



}



