var config = require('../config');
var Aticle = require('../proxy/aticle.js');
var User = require('../proxy/user.js');

var validator = require('validator');
var EventProxy = require('eventproxy');
var moment = require('moment');
var xss = require('xss');
var _ = require('../lib/tools.js');
var util = require('../util/util.js');



//findOnePage
exports.showAticleList = function(req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Aticle.findOnePage(page, function(err, lists, count) {
        if (err) {
            return (err);
        }
        //正则提取图片路径
        function getImgSrc(str) {
            var imgReg = /<img.*?(?:>|\/>)/gi;
            var srcReg = /src=['"]?([^'"]*)['"]?/i;
            var arr = str.match(imgReg);
            if (arr == null) {
                return 'nopic'
            }

            for (var i = 0; i < arr.length; i++) {
                var src = arr[i].match(srcReg);
                if (src[1]) {
                    return (src[1])
                } else {
                    return 'nopic'
                }
            }

        }


        var ep = new EventProxy();
        /**辅助函数**/

        function getAuthorById(id) {
            User.getUserID(id, function(err, data) {
                if (err) {
                    return
                }
                var clear_data = _.pick(data, ['nickname', 'avatar', '_id']);
                ep.emit('got_file', clear_data);
                return clear_data

            })
        }


        lists = lists.map(function(item, index) {
            console.log(index);
            return {
                _id: item._id,
                update_at: moment(item.update_at).format('YYYY-MM-DD'),
                title: item.title,
                content: item.content,
                thumb: getImgSrc(item.content),
                author: getAuthorById(item.author_id),
                des: item.des
            };
        });



        ep.after('got_file', lists.length, function(list) {

            var _lists = lists.map(function(item, index) {

                item.author = list[index];
                return item

            })

            // 在所有文件的异步执行结束后将被执行
            // 所有文件的内容都存在list数组中()
            res.render('aticle', {
                page: page,
                aticles: _lists,
                prev: 'p=' + parseInt(page - 1),
                next: 'p=' + parseInt(page + 1),
                count: count,
            })


        });



    })
};

exports.showCreate = function(req, res) {

    res.render('create-aticle', {
        user: req.session.user,
        Domain: config.qn_access.Domain,
        uploadURL: config.qn_access.uploadURL
    })

}

exports.create = function(req, res) {

    var title = xss(validator.trim(req.body.title));
    var content = xss(validator.trim(req.body.content));
    var authorId = req.session.user._id;

    if (!authorId) {

        res.render('create-aticle', {
            success: '请先登录'
        });
        return

    }


    Aticle.newAndSave(title, content, authorId, function(err) {

        if (err) {
            return next(err);
        }
        res.render('create-aticle', {
            success: '发布成功！'
        });

    })

};

/*********编辑文章*********/

exports.showEdit = function(req, res, next) {
    var aticle_id = req.params._id;

    Aticle.findAticleById(aticle_id, function(err, aticle) {
        if (!aticle) {
            res.render('notify', {
                error: '此文章不存在或已被删除。'
            });
            return;
        }

        var is_author = true || util.visiter_is_author(req, aticle.author_id);


        if (is_author) {
            res.render('create-aticle', {
                edit: true,
                aticle_id: aticle._id,
                title: aticle.title,
                content: aticle.content,
                des: aticle.des,
                user: req.session.user,
                Domain: config.qn_access.Domain,
                uploadURL: config.qn_access.uploadURL

            })
        } else {
            res.render('notify', {
                error: '此文章不存在或已被删除。'
            });
        }
    });
};


exports.showDetail = function(req, res) {
    var _id = req.params._id;



    Aticle.findOneAticle(_id, function(err, doc) {

        var aticle = _.pick(doc, ['_id', 'title', 'content', 'author_id']);
        aticle.update_at = moment(doc.update_at).format('YYYY-MM-DD hh:mm:ss'),
        User.getUserID(doc.author_id, function(err, data) {

            aticle.author = {
                nickname: data.nickname,
                avatar: data.avatar,
                _id: data._id
            };

            var is_author = util.visiter_is_author(req, data._id);

            console.log('is_author', is_author)



            res.render('aticle-view', {
                aticle: aticle,
                is_author: is_author
            })

        })



    })


}



exports.delAticleById = function(req, res) {
    var id = req.body.id;
    Aticle.delAticleById(id, function() {

    })
}