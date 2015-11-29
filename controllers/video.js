var config = require('../config');
var Video = require('../proxy/').Video;
var validator    = require('validator');


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
    category:config.video_category,
    prev:'p='+parseInt(page-1),
    next:'p='+parseInt(page+1),
    count:count})


  })
};

exports.showCreate=function(req, res){

  res.render('create-video',{
        category:config.video_category,

        Domain: config.qn_access.Domain,
        Uptoken_Url: config.qn_access.Uptoken_Url
    })

}

exports.publish = function(req, res) {
// title, discrib,cover_url, video_url,duration,category,authorId,
   var title = validator.trim(req.body.title);
   var discrib = validator.trim(req.body.discrib);
      var cover_url = validator.trim(req.body.cover_url);
   var video_url = validator.trim(req.body.video_url);
   var duration = validator.trim(req.body.duration);
   var category=validator.trim(req.body.category);
   var authorId=req.session.user._id || '000';
   Video.newAndSave(title, discrib,cover_url, video_url,duration,category,authorId, function(err){
       if (err) {
        return next(err);
              }
    res.render('create-video',{success:'发布成功！'});

   })

};

var isOutUrl=function(string){
   return string.indexOf('http') < 0
}
exports.showDetail=function(req, res,next){
   var _id=req.params._id;
   Video.findOneVideo(_id,function(err,video){
 if (err) {
        return next(err);
              }


     if (isOutUrl(video.video_url)) {
                video.video_url = config.qn_access.Domain + '/' + video.video_url;
            }
         console.log('video is',video);
       
      res.render('video-view',{
        video:video,
        })
   })
}




