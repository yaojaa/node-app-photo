var models  = require('../models');
var Aticle    = models.Aticle;
var Photo    = models.Photo;



//搜索返回
exports.search=function(keyword,page,callback){

var reg=new RegExp(keyword,'i');

	Aticle.find({title:reg})
	.limit(10)
	.skip((page-1)*10)
	.sort('-create_at')
	.exec(function(err,docs){

		callback(err,docs)

	})
	
};

