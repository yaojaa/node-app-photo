var models  = require('../models');
var Video    = models.Video;
var uuid    = require('node-uuid');


exports.newAndSave = function (title, discrib,cover_pic, url,duration,size,tages,authorId, callback) {
    var video       = new Video();
    video.title     = title;
    video.discrib   = discrib;
    video.cover_pic = cover_pic;
    video.url 		= url;
    video.duration	=duration;
    video.size		=size;
    tags			=tags;

    video.author_id = authorId;
    video.save(callback);
};

exports.findAll=function(callback){
	Video.find({}).limit(100).sort({time:1}).exec(callback)
};

//返回文章列表和数量
exports.findOnePage=function(page,callback){

    Video.count({},function(err,total){

	Video.find({})
	.limit(10)
	.skip((page-1)*10)
	.sort('-create_at')
	.exec(function(err,docs){

		callback(err,docs,total)

	})
	})
	
};

exports.findOneVideo=function(_id,callback){
	Video.findOne({'_id':_id},callback)

}

