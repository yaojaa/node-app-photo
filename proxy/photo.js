var config = require('../config');
var models = require('../models');
var Photo = models.Photo;

var list_photo_count = config.list_photo_count;

exports.getPhotosByQuery = function(query, opt, callback) {
    query.deleted = false;
    Photo.find(query, {}, opt, function(err, topics) {
        if (err) {
            return callback(err);
        }
        if (topics.length === 0) {
            return callback([]);
        }
        return callback(topics);

    });
};

exports.newAndSave = function(title, discrib, pictures, category, authorId,price, callback) {
    var picture = new Photo();
    picture.title = title;
    picture.discrib = discrib;
    picture.pictures = pictures;
    picture.category = category;
    picture.author_id = authorId;
    picture.price=price;
    picture.save(callback);
};

exports.findAll = function(callback) {
    Photo.find({}).limit(100).sort({
        time: 1
    }).exec(callback)
};

//返回图片列表和数量
exports.findOnePage = function(page, category, callback) {

    var categoryquery;
    if (category == 'all') {
        categoryquery = {};
    } else {

        categoryquery = {
            'category': category
        }
    }
console.log('需要返回的图片数量',list_photo_count);
    Photo.count(categoryquery, function(err, total) {
        Photo.find(categoryquery, {
                "pictures": {
                    "$slice": 4
                }
            })
            .limit(list_photo_count)
            .skip((page - 1) * list_photo_count)
            .sort('-create_at')
            .exec(function(err, docs) {
                // console.log(docs.pictures.splice(0,4));
                callback(err, docs, total)
            })
    })

};


exports.findOnePhoto = exports.findPhotoById = function(_id, callback) {
    Photo.findOne({
        '_id': _id
    }, callback)

}


exports.delPhotoById = function(_id, callback) {

    Photo.remove({
        '_id': _id
    }).exec(function(err, status) {
        callback(err, status.result)
    })

}
