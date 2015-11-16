var config = require('../config');
var Video = require('../proxy/video.js');
var validator = require('validator');
var eventproxy = require('eventproxy');


//findOnePage
exports.showVideoList = function(req, res) {

    var page = req.query.p ? parseInt(req.query.p) : 1;


  Video.findOnePage(page,function(err,lists,count){

     if (err) {
        return (err);
              }

  res.render('video',{
    page:page,
    videos:lists,
    prev:'p='+parseInt(page-1),
    next:'p='+parseInt(page+1),
    count:count})


  })
};

exports.showCreate=function(req, res){

  res.render('create-video',{
        Domain: config.qn_access.Domain,
        Uptoken_Url: config.qn_access.Uptoken_Url
    })

}

exports.publish = function(req, res) {

   var title = validator.trim(req.body.title);
   var discrib = validator.trim(req.body.discrib);
   var tags=validator.trim(req.body.tags);
   var pictures= req.body.pictures;
   var authorId=req.session.user._id || '000';
   Video.newAndSave(title, discrib, pictures,authorId, function(err){
       if (err) {
        return next(err);
              }
    res.render('create-video',{success:'发布成功！'});

   })

};


exports.showDetail=function(req, res){
   var _id=req.params._id;
   Video.findOneVideo(_id,function(err,doc){
      res.render('video-view',{
        video:doc
  })


   })



}



