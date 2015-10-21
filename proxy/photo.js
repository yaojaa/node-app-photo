var models  = require('../models');
var Photo    = models.Photo;


exports.newAndSave = function (title, content, authorId, callback) {
    var topic       = new Aticle();
    topic.title     = title;
    topic.content   = content;
    topic.author_id = authorId;
    topic.save(callback);
};

exports.findAll=function(callback){
	Photo.find({}).limit(100).sort({time:1}).exec(callback)
};

//返回文章列表和数量
exports.findOnePage=function(page,callback){

    Photo.count({},function(err,total){

	Photo.find({})
	.limit(10)
	.skip((page-1)*10)
	.sort('-create_at')
	.exec(function(err,docs){

		callback(err,docs,total)

	})
	})
	
};

exports.findOnePhoto=function(_id,callback){
	Photo.findOne({'_id':_id},callback)

}

