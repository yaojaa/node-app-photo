var models  = require('../models');
var Photo    = models.Photo;

exports.getPhotosByQuery = function (query, opt, callback) {
  query.deleted = false;
  Photo.find(query, {}, opt, function (err, topics) {
    if (err) {
      return callback(err);
    }
    if (topics.length === 0) {
      return callback([]);
    }
      return callback(topics);

    });
};

exports.newAndSave = function (title, discrib,pictures,category, authorId, callback) {
    var picture       = new Photo();
    picture.title     = title;
    picture.discrib   = discrib;
    picture.pictures = pictures;
    picture.category = category;
    picture.author_id = authorId;
    console.log(picture);
    picture.save(callback);
};

exports.findAll=function(callback){
	Photo.find({}).limit(100).sort({time:1}).exec(callback)
};

//返回文章列表和数量
exports.findOnePage=function(page,category,callback){


var categoryquery;
if(category=='all'){
 categoryquery={};
}else{

   categoryquery={
  'category':category}
}



  Photo.count({},function(err,total){

	Photo.find(categoryquery,{"pictures":{"$slice":4}})
	.limit(10)
	.skip((page-1)*10)
	.sort('-create_at')
	.exec(function(err,docs){
		// console.log(docs.pictures.splice(0,4));
		callback(err,docs,total)
	})
	})
	
};

exports.findOnePhoto=function(_id,callback){
	Photo.findOne({'_id':_id},callback)

}


exports.delPhotoById=function(_id,callback){

  Photo.remove({'_id':_id}).exec(function(err,status){
    callback(err,status.result)
  })

}

