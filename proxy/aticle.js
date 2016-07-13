var models = require('../models');
var async = require('async');
var Aticle = models.Aticle;


exports.newAndSave = function (title, des, content, authorId, callback) {
    var topic = new Aticle();
    topic.title = title;
    topic.des = des;
    topic.content = content;
    topic.author_id = authorId;
    topic.save(callback);
};


exports.findLast = function (limit, callback) {
    Aticle.find({}).limit(limit).sort({time: 1}).exec(callback)
};


exports.findList = function (page, limit, callback) {


    Aticle.count({}, function (err, total) {
        Aticle.find({})
            .limit(limit)
            .skip((page - 1) * 10)
            .sort('-create_at')
            .exec(function (err, docs) {

                callback(err, docs, total)

            })
    })


};


exports.findAll = function (callback) {
    Aticle.find({}).limit(100).sort({time: 1}).exec(callback)
};

//返回文章列表和数量
exports.findOnePage = function (page, callback) {

    Aticle.count({}, function (err, total) {

        Aticle.find({})
            .limit(10)
            .skip((page - 1) * 10)
            .sort('-create_at')
            .exec(function (err, docs) {

                callback(err, docs, total)

            })
    })

};

exports.findOneAticle = exports.findAticleById = function (_id, callback) {
    Aticle.findOne({'_id': _id}, callback)

}

exports.delAticleById = function (_id, callback) {

    Aticle.remove({'_id': _id}).exec(function (err, status) {
        callback(err, status.result)
    })

}


/**
 * 分页查询
 * @param query 查询条件
 * @param keys 查询的字段
 * @param opt 排序，分页如{pageNo: 1，pageSize: 10, sort: '-create_at'}
 * @param callback
 */
exports.page = function (query, keys, opt, callback) {
    var pageNo = opt.pageNo || 1;
    var pageSize = opt.pageSize || 10;
    pageNo--;

    async.parallel({
            one: function (callback) {
                var skip = pageNo * pageSize;
                var limit = pageSize;

                opt.skip = skip;
                opt.limit = limit;
                Aticle.find(query, keys, opt, callback);
            },
            two: function (callback) {
                Aticle.count(query, callback);
            }
        },
        function (err, results) {

            var list = results.one;
            var count = results.two;//总记录数
            var total = Math.ceil(count / pageSize);//总页数
            callback(null, {list: list, count: count, total: total});

        });

};
