var config = require('../config');
var Photo = require('../proxy/photo.js');
var User = require('../proxy/user.js');
var validator = require('validator');
var EventProxy = require('eventproxy');
var _= require('../lib/tools.js');

var moment=require('moment');

var list_photo_count = config.list_photo_count;


//显示列表
exports.showPhotoList = function (req, res) {

  var page = req.query.p ? parseInt(req.query.p) : 1;
  var currentCategory = req.query.category || 'all';

  var user = req.session.user;
  //是否显示推荐按钮
  var showRecommend = false;
  if (user && user.isadmin) {
    showRecommend = true;
  }
  res.render('photo', {
    category: config.category,
    currentCategory: currentCategory,
    showRecommend: showRecommend
  });

  /*Photo.findOnePage(page, currentCategory, function (err, lists, count) {

   if (err) {
   return (err);
   }

   res.render('photo', {
   category: config.category,
   currentCategory: currentCategory,
   page: page,
   photos: lists,
   prev: 'p=' + parseInt(page - 1),
   next: 'p=' + parseInt(page + 1),
   isFirstPage: (page - 1) == 0,
   isLastPage: ((page - 1) * list_photo_count + lists.length) >= count,
   count: count
   })
   })*/
};

exports.showCreate = function (req, res) {

  res.render('create-photo', {
    category: config.category,
    Domain: config.qn_access.Domain,
    Uptoken_Url: config.qn_access.Uptoken_Url
  })

}

exports.publish = function (req, res) {

  var title = validator.trim(req.body.title);
  var discrib = validator.trim(req.body.discrib);
  var tags = validator.trim(req.body.tags);
  var pictures = req.body.pictures;
  var category = req.body.category;
  var authorId = req.session.user.id;
  var price = validator.trim(req.body.price)
  Photo.newAndSave(title, discrib, pictures, category, authorId, price, function (err) {
    if (err) {
      return next(err);
    }
    res.render('create-photo', {success: '发布成功！'});

  })

};

/**
 * 图片正文页

 */

//
exports.showDetail = function (req, res) {

  var _id = req.params._id;
  var usermail = req.session.user ? req.session.user.email : '';
  var user_id = req.session.user ? req.session.user.id : '';

  var ep = new EventProxy();


  ep.all('dataPhoto', 'isBuy', 'author', 'isFollow', function (dataPhoto, isBuy, author, isFollow) {


        var tmpData=_.pick(dataPhoto);
        tmpData.update_at=moment(tmpData.update_at).fromNow();

        //如果作者是当前登录用户
        if(author._id!=user_id){

          var authorIsNotSelf=true

        }



        //修改浏览次数
          Photo.updateCountById(_id, 1, function (err) {
            if (err) {
              return console.error('修改图片浏览次数出错了:', err);
            }

          });

        res.render('photo-view', {
            title: dataPhoto.title,
            photo: tmpData,
            authorIsNotSelf:authorIsNotSelf,
            isBuy: isBuy,
            author: author,
            isFollow: isFollow
        })

      })


  //1.判断是否购买
  if (usermail) {

    var checkIsBuy = (function () {
      if (!usermail) {
        return ep.emit('isBuy', false);
      }

      User.getUserByMail(usermail, function (err, userData) {
        if (err) {
          return ep.emit('error', err);
        }
        console.log(userData.hasBuy, _id);
        if (userData.hasBuy.indexOf(_id) > -1) {
          ep.emit('isBuy', true);
        } else {
          ep.emit('isBuy', false);
        }
      })
    })()

  } else {

    ep.emit('isBuy', false);

  }


  //2.获取图片信息
  Photo.findPhotoById(_id, function (err, dataPhoto) {
    if (err) {
      return ep.emit('error', err);
    }

    if(dataPhoto.author_id==user_id){
       ep.emit('isBuy', true);
    }

    ep.emit('dataPhoto', dataPhoto);

    getAuthorInfo(dataPhoto.author_id)

  })

  //3.获取作者信息

  function getAuthorInfo(id) {
    User.getUserID(id, function (err, data) {
      if (err) {
        return err
      }

      if (data.fans.indexOf(user_id) > -1) {
        ep.emit('isFollow', true);
      } else {
        ep.emit('isFollow', false);

      }

      ep.emit('author', data);
    })

  }








}

/**
 * 首页图片展示
 * t1:最新
 * t2:热门
 * t3:我关注的
 * @param req
 * @param res
 */

exports.findList = function (req, res) {
  var type = parseInt(req.body.type);
  var pageNo = req.body.pageNo;
  var where = {};
  var options = {pageNo: pageNo, sort: '-create_at'};
  switch (type) {
    case 2:
      options.sort = '-browse_cnt';
      break;
    case 3:
      if (!req.session.user) {
        return res.fail('未登录');
      }
      var follow = req.session.user.follow;
      where._id = {'$in': follow};
      break;
  }
  Photo.page(where, {}, options, function (err, page) {
    if (err) {
      return res.fail();
    }
    res.ok(page.list);
  });
}

/**
 *
 * @param req
 *  req.query.classify:editors,fresh,popular
 *  req.query.categories:图片分类
 * @param res
 */
exports.classify = function (req, res, next) {
  var classify = req.query.classify;
  var categories = req.query.categories;
  var pageNo = req.query.pageNo;
  var where = {};
  var keys = {
    /*pictures: {$slice: 1}*/
  };
  var options = {pageNo: pageNo, sort: '-create_at'};
  if (classify === 'popular') {
    options.sort = '-browse_cnt';
  } else if (classify === 'editors') {
    where.recommend = true;
  }
  if (categories) {
    where.category = categories;
  }

  Photo.page(where, keys, options, function (err, page) {
    var list = page.list;
    if (err) {
      return res.fail();
    }
    if (list.length === 0) return res.ok([]);
    var userIds = [];
    list = list.map(function (item) {
      item = item.toObject();
      userIds.push(item.author_id);
      return item;
    });

    //查询图集所属用户
    User.findByIds(userIds, function (err, users) {
      if (err) {
        console.error('查询图集所属的用户信息出错：', err.stack);
        return res.ok(list);
      }
      list.forEach(function (item) {
        for (var i = 0, length = users.length; i < length; i++) {
          var user = users[i];
          if (item.author_id == user._id) {
            item.userName = user.nickname || user.user_name;
            item.userAvatar = user.avatar;
            break;
          }

        }

      });
      res.ok(list);
    });
  });
};

/**
 *  推荐图集
 * @param req
 *  req.query.id
 *    图集ID
 * @param res
 */
exports.recommend = function (req, res) {
  var user = req.session.user;
  if (!user) {
    return res.fail('请登录');
  }
  if (!user.isadmin) {
    return res.fail('非管理员操作');
  }
  var id = req.query.id;
  if (!id) return res.fail();
  Photo.update(id, {recommend: true}, function (err, ret) {
    if (err) return res.fail();
    res.ok(ret);
  })
};
