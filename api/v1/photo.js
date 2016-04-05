var config = require('../../config');
var Eventproxy = require('eventproxy');
// var models        = require('../../models');
// var PhotoModel   = models.photo;
var PhotoProxy = require('../../proxy').Photo;
var UserProxy = require('../../proxy').User;


/**
 limit 限制数量
 page 第几页
 */

var index = function (req, res, next) {
    var limit = Number(req.query.limit) || config.list_topic_count;
    var page = parseInt(req.query.page, 10) || 1;
    var query = {};

    PhotoModel.find({}).limit(limit)
      .skip((page - 1) * limit)
      .sort({time: 1}).exec(function (err, topics) {

          var datas = topics.map(function (item) {

              return newdata = {
                  id: item._id,
                  title: item.title,
                  content: item.content,
                  time: item.update_at
              }

          })

          res.send({data: datas});

      })


}

var delPhoto = function (req, res, next) {
    var id = req.body.id;
    PhotoProxy.delPhotoById(id, function (err) {

        if (err) {
            return next(err);
        }
        res.json({errorno: 0, msg: "删除成功"});

    })

}
/*检查是否以及购买过文章*/

var checkIsBuy = function (req, res, next) {

    var usermail = req.session.user.email;
    var photoId = req.body.photoId;
    if (!usermail) {
        res.json({errorno: -1, msg: "未登录"});
        return next()
    }

    UserProxy.getUserByMail(usermail, function (err, userData) {
        if (err) {
            return res.json({errorno: -1, msg: "getUserByMail数据出错"})

        }
        if (userData.hasBuy.indexOf(photoId) > -1) {
            res.json({errorno: 0, msg: "已购买"})
            // PhotoProxy.findPhotoById(photoId, function (err, dataPhoto) {
            // return  res.json({errorno:0,msg:"已购买",data:dataPhoto.pictures})
            // })
        } else {
            res.json({errorno: -1, msg: "未购买"})

        }
    })
}

/*购买*/

var buyPhoto = function (req, res, next) {

    var usermail = req.session.user.email;
    var userId = req.session.user.id;
    var photoId = req.body.photoId;
    var ep = new Eventproxy();
    ep.all('userReady', 'photoReady', function (user, photo) {

        if (user.hasBuy.indexOf(photoId) > -1) {
            return res.json({errorno: -3, msg: "你已经购买过啦"});
        }

        //账户余额不够
        if (user.money < photo.price) {
            return res.json({errorno: -2, msg: "账户余额不足"});

        } else {
            //扣钱，更新数据 { $set: dataobj}

            //更新图集购买的人数 +1

            PhotoProxy.updateTrade_cnt(photoId, function (err, data) {

            });

            //更新user账户数据
            UserProxy.updateUser(user._id, {
                $set: {money: parseInt(user.money - photo.price)},
                $push: {hasBuy: photoId}
            }, function (err, res) {

                req.session.user.money = user.money - photo.price;

                if (err) {
                    return
                }

                if (res.ok == 1) {
                    ep.emit('buySuccess');
                    //写入已购买数组
                }

            })

        }


    });

    ep.on('buySuccess', function () {
        //添加已购买photoId
        res.json({errorno: 0, msg: "购买成功！"});
    });


    UserProxy.getUserByMail(usermail, function (err, userData) {

        if (err) {
            return next()
        }
        ep.emit('userReady', userData)

    });


    PhotoProxy.findPhotoById(photoId, function (err, photoData) {
        if (err) {
            return next()
        }
        ep.emit('photoReady', photoData)

    });


};


/*关注、取消关注*/

exports.follow = function (req, res, next) {
    var user = req.session.user.id;
    var author = req.body.author_id;


    UserProxy.follow(author, user, function (err) {

        if (err) {
            return res.json({errorno: -1, msg: "关注失败！"});
        }
        res.json({errorno: 0, msg: "关注成功！"});

    })

}


exports.unfollow = function (req, res, next) {

    var user = req.session.user.id;
    var author = req.body.author_id;

    UserProxy.unfollow(author, user, function (err) {

    if (err) {
        return res.json({errorno: -1, msg: "取消关注失败！"});
    }
    res.json({errorno: 0, msg: "取消关注成功！"});

    })

};


exports.buyPhoto = buyPhoto;

exports.delPhoto = delPhoto;

exports.checkIsBuy = checkIsBuy;

exports.index = index;
