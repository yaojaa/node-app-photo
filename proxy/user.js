var models = require('../models');
var User = models.User;
var uuid = require('node-uuid');
var config = require('../config');
var async = require('async');


/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({'email': email}, callback);
};

exports.getUserByMailOrNickname = function (email, nickname, callback) {
    User.findOne({'$or': [{'email': email}, {'nickname': nickname}]}, callback);
};

exports.getUserByName = function (username, callback) {
    User.findOne({'user_name': username}, callback);
};

exports.getUserID = function (id, callback) {
    User.findOne({'_id': id}, callback);
};


exports.findByIds = function (ids, callback) {
    User.find({'_id': {'$in': ids}}, callback);
};

//根据微信唯一标示查找用户
exports.getOpenid = function (openid, callback) {
    User.findOne({'openid': openid}, callback);
};

exports.newAndSave = function (password, email, nickname, active, callback) {
    var user = new User();
    user.password = password;
    user.email = email;
    user.nickname = nickname;
    user.avatar = config.avatar;
    user.active = active || false;
    user.accessToken = uuid.v4();
    user.save(callback);
};

//添加新用户
exports.add = function (model, callback) {
    model.accessToken = uuid.v4();
    model.avatar = model.avatar || config.avatar;
    User.create(model, function (err, model) {
            if (err) {
                console.error('添加新用户：', err.stack);
                return callback(err);
            }
            callback(err, model);
        }
    );
};

// Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);
//http://www.nodeclass.com/api/mongoose.html#guide_documents

exports.updateUser = function (id, query, callback) {
    User.update({_id: id}, query, callback);
}

exports.fillMoney = function (id, moneyNum, callback) {
    User.update({_id: id}, {$set: {money: moneyNum}}, callback);
}


exports.pushHasBuy = function (id, photoID, callback) {
    User.update({_id: id}, {$push: {hasBuy: photoID}}, callback);
}

exports.update = function (id, model, callback) {
    User.update({_id: id}, model, {multi: false}, callback);
}

//关注某人
exports.follow = function (followID, userID, callbacks) {

    console.log('关注某人', followID, userID)

    async.parallel({
            one: function (callback) {

                User.findOneAndUpdate({'_id': userID}, {$addToSet: {followings: followID}}, {new: true}, callback)


            },
            two: function (callback) {

                User.findOneAndUpdate({'_id': followID}, {$addToSet: {fans: userID}}, {new: true}, callback)


            }
        },
        function (err, results) {

            console.log('err', err)


            console.log('results', results)

            callbacks(err, results);

        })
}

//取消关注某人
exports.unfollow = function (followID, userID, callbacks) {
    async.parallel({
            one: function (callback) {
                User.update({_id: userID}, {$pull: {followings: followID}}, callback);

            },
            two: function (callback) {
                User.update({_id: followID}, {$pull: {fans: userID}}, callback);

            }
        },
        function (err, results) {

            console.log('results', results)

            callbacks(err, results);

        });

};

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
                User.find(query, keys, opt, callback);
            },
            two: function (callback) {
                User.count(query, callback);
            }
        },
        function (err, results) {
            var list = results.one;
            var count = results.two;//总记录数
            var total = Math.ceil(count / pageSize);//总页数
            callback(null, {list: list, count: count, total: total});

        });

};

/**
 * 分页查询
 * @param query 查询条件
 * @param keys 查询的字段
 * @param opt 排序，分页如{pageNo: 1，pageSize: 10, sort: '-create_at'}
 * @param callback
 */
exports.find = function (query, keys, opt, callback) {

    User.find(query, keys, opt, callback);

};