var config	= require('../config');
var models  = require('../models');
var Video    = models.Video;

//发布视频
exports.newAndSave = function (title, discrib,cover_url, video_url,duration,category,authorId, callback) {
    var video       = new Video();
    video.title     = title;
    video.discrib   = discrib;
    video.cover_url = cover_url;
    video.video_url 		= video_url;
    video.duration	=duration;
    video.category			=category;
    video.author_id = authorId;
    video.save(callback);
};

exports.findAll=function(callback){
	Video.find({}).limit(100).sort({time:1}).exec(callback)
};


//api 返回视频列表和数量
exports.getvideolist=function(opt,callback){

//	console.log('getvideolist1',opt)

	var query;
    if (opt.category == 'all' || opt.category=='undefined' || opt.category=='') {
        query = {};
    } else {

        query = {
            'category': opt.category
        }
    }

	var options={
		limit:opt.limit||config.list_video_count,
		page:1 || opt.page
	}

Video.count(query,function(err, total){

   console.log('count',total)

})

	Video.find(query)
	.limit(options.limit)
	.skip((options.page-1)*10)
	.sort('-create_at')
	.exec(function(err,videos){
		callback(err,videos)
	})
	
};

//返回视频列表和数量
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

