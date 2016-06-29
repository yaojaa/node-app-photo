var models  = require('../models');
var Aticle    = models.Aticle;


exports.newAndSave = function (title,des, content, authorId, callback) {
    var topic       = new Aticle();
    topic.title     = title;
    topic.des       = des;
    topic.content   = content;
    topic.author_id = authorId;
    topic.save(callback);
};

exports.findAll=function(callback){
	Aticle.find({}).limit(100).sort({time:1}).exec(callback)
};

//返回文章列表和数量
exports.findOnePage=function(page,callback){

    Aticle.count({},function(err,total){

	Aticle.find({})
	.limit(10)
	.skip((page-1)*10)
	.sort('-create_at')
	.exec(function(err,docs){

		callback(err,docs,total)

	})
	})
	
};

exports.findOneAticle=function(_id,callback){
	Aticle.findOne({'_id':_id},callback)

}

exports.delAticleById=function(_id,callback){

	Aticle.remove({'_id':_id}).exec(function(err,status){
		callback(err,status.result)
	})

}

