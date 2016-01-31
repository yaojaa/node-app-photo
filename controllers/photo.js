var config = require('../config');
var Photo = require('../proxy/photo.js');
var validator = require('validator');
var eventproxy = require('eventproxy');

var list_photo_count = config.list_photo_count;


//显示列表
exports.showPhotoList = function (req, res) {

  var page = req.query.p ? parseInt(req.query.p) : 1;
  var currentCategory = req.query.category || 'all';
  Photo.findOnePage(page, currentCategory, function (err, lists, count) {

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
  })
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
  var authorId = req.session.user.id || '000';
  var price = validator.trim(req.body.price)
  Photo.newAndSave(title, discrib, pictures, category, authorId, price, function (err) {
    if (err) {
      return next(err);
    }
    res.render('create-photo', {success: '发布成功！'});

  })

};


exports.showDetail = function (req, res) {
  var _id = req.params._id;
  Photo.findPhotoById(_id, function (err, dataPhoto) {
    console.log(dataPhoto);
    res.render('photo-view', {
      title: dataPhoto.title,
      photo: dataPhoto
    })
  })

  //修改浏览次数
  Photo.updateCountById(_id, 1, function (err) {
    if (err) {
      console.error('修改图片浏览次数出错了:', err);
    }
  });
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
  Photo.page(where, {}, options, function (err, list) {
    if (err) {
      return res.fail();
    }
    res.ok(list);
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
    pictures: {$slice: 1}
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

  Photo.page(where, keys, options, function (err, list) {
    if (err) {
      return res.fail();
    }
    res.ok(list);
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
  var id = req.query.id;
  if (!id) return res.fail();
  Photo.update(id, {recommend: true}, function (err, ret) {
    if (err) return res.fail();
    res.ok(ret);
  })
};