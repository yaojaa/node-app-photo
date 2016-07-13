var User = require('../../proxy/user');
var Aticle = require('../../proxy/aticle');
var config = require('../../config');
var validator = require('validator');
var moment = require('moment');
var async = require('async');

exports.page = function (req, res, next) {
    var body = req.body;
    var title = validator.trim(body.title);
    var author = validator.trim(body.author);
    var pageNo = body.pageNo;
    var pageSize = body.pageSize;
    var userList = [];
    var where = {};
    if (title) {
        where['title'] = {'$regex': title};
    }

    async.waterfall([function (callback) {
        if (author) {
            User.find({'nickname': {'$regex': author}}, {}, {}, callback);
        } else {
            callback(null, null);
        }
    }, function (users, callback) {
        if (users == null) {
            callback(null, true);
        } else if (users.length === 0) {
            callback(null, false);
        } else {
            var ids = users.map(function (user) {
                userList.push(user);
                return user._id;
            });
            where['author_id'] = {'$in': ids};
            callback(null, true);
        }
    }, function (mark, callback) {
        if (mark) {
            var opt = {
                pageNo: pageNo,
                pageSize: pageSize,
                sort: '-create_at'
            };
            Aticle.page(where, {}, opt, callback);
        } else {
            callback(null, {list: [], count: 0, total: 0});
        }
    }, function (result, callback) {
        if (result.count !== 0 && userList.length === 0) {
            var ids = result.list.map(function (item) {
                return item.author_id;
            });
            User.find({'_id': {'$in': ids}}, {}, {}, function (err, list) {
                userList = list;
                callback(err, result);
            });
        } else {
            callback(null, result);
        }
    }], function (err, result) {
        if (err) {
            console.log('查询图文列表出错', err.stack);
            return res.send({status: "001", msg: '系统错误，请稍后重试'});
        }

        result.list = result.list.map(function (item) {

            var author = '';
            for (var j = userList.length - 1; j >= 0; j--) {
                var user = userList[j];
                if (user._id == item.author_id) {
                    author = user.nickname || user.email;
                    break;
                }
            }

            return {
                id: item._id,
                title: item.title,
                author_id: item.author_id,
                author: author,
                create_at: moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')
            };
        });

        res.send({status: "000", msg: result});
    });

};


exports.del = function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.fail('请选择一个图集');
    }
    Aticle.delAticleById(id, function (err) {
        if (err) {
            return res.fail('删除失败');
        }
        res.ok();
    });
};


exports.detail = function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.fail('请选择一个图集');
    }
    Aticle.findOneAticle(id, function (err, item) {
        if (err) return next(err);
        var user = req.session.sysUser;
        res.render('sys/aticle_detail', {
            layout: 'admin',
            loginname: user['login_name'],
            aticleinfo: item 
        });
    })
};
