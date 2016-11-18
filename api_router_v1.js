var app           = require('express');
var bodyParser = require('body-parser');

var aticleController   = require('./api/v1/aticle');

var photoController   = require('./api/v1/photo');

var videoController   = require('./api/v1/video');

var ucenterController   = require('./api/v1/ucenter');

var auth		=	require('./middlewares/auth')

// 接口格式
// {errorno:0, msg:'',data:{}}


// var topicController   = require('./api/v1/topic');
// var userController    = require('./api/v1/user');
// var toolsController   = require('./api/v1/tools');
// var replyController   = require('./api/v1/reply');
// var messageController = require('./api/v1/message');
// var middleware        = require('./api/v1/middleware');
// var limit             = require('./middlewares/limit');
var config            = require('./config');

var router            = app.Router();

//获取用户信息
router.post('/getUserInfoById',ucenterController.getUserInfoById);

//获取文章列表

router.get('/getAticles', aticleController.getAticleList);
router.get('/getAticleById', aticleController.getAticleById);


router.get('/videolist', videoController.videolist);



router.post('/createAticle', auth.userRequired,aticleController.createAticle);

router.post('/updateAticle',auth.userRequired, aticleController.update);  // 提交编辑文章


// router.post('/delAticle',auth.userRequired,aticleController.delAticle);

// router.del('/delAticle',aticleController.delAticle);



router.post('/createPhoto',auth.userRequired, photoController.createPhoto);
router.post('/editPhoto',auth.userRequired, photoController.editPhoto);

router.post('/delPhoto', auth.adminRequired, photoController.delPhoto);
router.post('/delVideo', auth.adminRequired, videoController.delVideo);
router.post('/buyPhoto', auth.userRequired, photoController.buyPhoto);

router.post('/checkIsBuy', auth.userRequired, photoController.checkIsBuy);

//关注
router.post('/follow',auth.userRequired, photoController.follow);
router.post('/unfollow',auth.userRequired, photoController.unfollow);


//开通vip

router.post('/tovip', ucenterController.tovip);





// router.get('/topics', topicController.index);
// router.get('/topic/:id', topicController.show);
// router.post('/topics', middleware.auth, limit.peruserperday('create_topic', config.create_post_per_day), topicController.create);




// router.post('/topic/collect', middleware.auth, topicController.collect); // 关注某话题
// router.post('/topic/de_collect', middleware.auth, topicController.de_collect); // 取消关注某话题


// // 用户
// router.get('/user/:loginname', userController.show);

// // accessToken 测试
// router.post('/accesstoken', middleware.auth, toolsController.accesstoken);

// // 评论
// router.post('/topic/:topic_id/replies', middleware.auth, limit.peruserperday('create_reply', config.create_reply_per_day), replyController.create);
// router.post('/reply/:reply_id/ups', middleware.auth, replyController.ups);

// // 通知
// router.get('/messages', middleware.auth, messageController.index);
// router.get('/message/count', middleware.auth, messageController.count);
// router.post('/message/mark_all', middleware.auth, messageController.markAll);

module.exports = router;
