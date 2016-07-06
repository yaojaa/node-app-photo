var config = require('../../config');
var validator = require('validator');
var AticleProxy = require('../../proxy').Aticle;
var User = require('../../proxy').User;
var _ =require('../../lib/tools');

var EventProxy = require('eventproxy');

var moment = require('moment');




/**
limit 限制数量
page 第几页
*/


var getAticleList = function (req, res,next) {

    var page = req.query.page ? parseInt(req.query.page,10) : 1;
        page = page > 0 ? page : 1;
    var number = req.query.number ? parseInt(req.query.number) : 6;


    AticleProxy.findList(page,number, function (err, lists) {
      console.log(err,lists)
        if (err) {
            return (err);
        }


    //正则提取图片路径
    function getImgSrc(str){
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=['"]?([^'"]*)['"]?/i;
        var arr = str.match(imgReg);
        if(arr==null){
            return 'nopic'
        }

        for (var i = 0; i < arr.length; i++) {
            var src = arr[i].match(srcReg);
            if(src[1]){
            return (src[1])
            }else{
                 return 'nopic'
            }
        }

        }


      var ep = new EventProxy();
      /**辅助函数**/

      function getAuthorById(id){
          User.getUserID(id,function(err,data){
              if (err){
                  return 
              }
              var clear_data=_.pick(data,['nickname','avatar','_id']);
                  ep.emit('got_file', clear_data);
                  return clear_data

          })
      }


        lists = lists.map(function(item,index){
            return {
                _id : item._id,
                update_at : moment(item.update_at).format('YYYY-MM-DD'),
                title : item.title,
                thumb:getImgSrc(item.content),
                author:getAuthorById(item.author_id),
                des:item.des
            };
        });



    ep.after('got_file', lists.length, function (list) {

        var a_lists=lists.map(function(item,index){

            item.author=list[index];
            return item

        })

              res.json( {
                errorno:0,
                msg:'OK',
                aticles: a_lists
            })


    });




    })
};






var delAticle = function(req, res, next) {
  console.log(req.body.id);
  var id = req.body.id;
  console.log(AticleModel);
  AticleProxy.delAticleById(id, function(err) {

    if (err) {
      return next(err);
    }
    res.json({
      errorno: 0,
      msg: "删除成功"
    });
  })

}


var createAticle = function(req, res, next) {

  var title = validator.trim(req.body.title);
  var content = validator.trim(req.body.content);
  var des = validator.trim(req.body.des);
  var authorId = req.session.user.id;

  AticleProxy.newAndSave(title, des, content, authorId, function(err, data) {

    if (err) {
      return next(err);
    }

    res.json({
      errorno: 0,
      msg: '发布成功！',
      data: data
    });

  })

}


var update = function(req, res, next) {
    var topic_id = req.params._id;
    var title = validator.trim(req.body.title);
    var des = validator.trim(req.body.des);
    var content = validator.trim(req.body.content);

  AticleProxy.getAticleById(topic_id, function(err, topic) {
        if (!topic) {
            res.status(404).render('notify', { error: '此图集不存在或已被删除。' });
            return;
        }

        if (topic.author_id.equals(req.session.user._id) || req.session.user.is_admin) {
            title = validator.trim(title);
            content = validator.trim(content);

            // 验证
            var editError;
            if (title === '') {
                editError = '标题不能是空的。';
            } else if (title.length < 5 || title.length > 100) {
                editError = '标题字数太多或太少。';
            } 
            // END 验证

            if (editError) {
                return res.json({
                    action: 'edit',
                    errorno:-1,
                    msg: editError,
                    topic_id: topic._id,
                });
            }

            //保存话题
            topic.title = title;
            topic.content = content;
            topic.des = des;
            topic.update_at = new Date();

            topic.save(function(err) {
                if (err) {
                    return next(err);
                }
                //发送at消息
              //  at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);

              //  res.redirect('/topic/' + topic._id);

              res.json({
                errorno:0,
                msg:'编辑成功',
                data:{
                  aticle_id:topic._id
                }
              })

            });
        } else {
            res.renderError('对不起，你不能编辑此话题。', 403);
        }
    });
};



exports.delAticle = delAticle;
exports.createAticle = createAticle;
exports.getAticleList = getAticleList;
exports.update = update;






// var models       = require('../../models');
// var TopicModel   = models.Topic;
// var TopicProxy   = require('../../proxy').Topic;
// var TopicCollect = require('../../proxy').TopicCollect;
// var UserProxy    = require('../../proxy').User;
// var UserModel    = models.User;
// var config       = require('../../config');
// var eventproxy   = require('eventproxy');
// var _            = require('lodash');
// var at           = require('../../common/at');
// var renderHelper = require('../../common/render_helper');


// var index = function (req, res, next) {
//   var page     = parseInt(req.query.page, 10) || 1;
//   page         = page > 0 ? page : 1;
//   var tab      = req.query.tab || 'all';
//   var limit    = Number(req.query.limit) || config.list_topic_count;
//   var mdrender = req.query.mdrender === 'false' ? false : true;

//   var query = {};
//   if (tab && tab !== 'all') {
//     if (tab === 'good') {
//       query.good = true;
//     } else {
//       query.tab = tab;
//     }
//   }
//   query.deleted = false;
//   var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

//   var ep = new eventproxy();
//   ep.fail(next);

//   TopicModel.find(query, '', options, ep.done('topics'));

//   ep.all('topics', function (topics) {
//     topics.forEach(function (topic) {
//       UserModel.findById(topic.author_id, ep.done(function (author) {
//         if (mdrender) {
//           topic.content = renderHelper.markdown(at.linkUsers(topic.content));
//         }
//         topic.author = _.pick(author, ['loginname', 'avatar_url']);
//         ep.emit('author');
//       }));
//     });

//     ep.after('author', topics.length, function () {
//       topics = topics.map(function (topic) {
//         return _.pick(topic, ['id', 'author_id', 'tab', 'content', 'title', 'last_reply_at',
//           'good', 'top', 'reply_count', 'visit_count', 'create_at', 'author']);
//       });

//       res.send({data: topics});
//     });
//   });
// };

// exports.index = index;

// var show = function (req, res, next) {
//   var topicId  = req.params.id;
//   var mdrender = req.query.mdrender === 'false' ? false : true;
//   var ep       = new eventproxy();

//   ep.fail(next);

//   TopicProxy.getFullTopic(topicId, ep.done(function (msg, topic, author, replies) {
//     if (!topic) {
//       return res.send({error_msg: 'topic_id `' + topicId + '` is not exists.'});
//     }
//     topic = _.pick(topic, ['id', 'author_id', 'tab', 'content', 'title', 'last_reply_at',
//       'good', 'top', 'reply_count', 'visit_count', 'create_at', 'author']);

//     if (mdrender) {
//       topic.content = renderHelper.markdown(at.linkUsers(topic.content));
//     }
//     topic.author = _.pick(author, ['loginname', 'avatar_url']);

//     topic.replies = replies.map(function (reply) {
//       if (mdrender) {
//         reply.content = renderHelper.markdown(at.linkUsers(reply.content));
//       }
//       reply.author = _.pick(reply.author, ['loginname', 'avatar_url']);
//       reply =  _.pick(reply, ['id', 'author', 'content', 'ups', 'create_at']);
//       return reply;
//     });
//     res.send({data: topic});
//   }));
// };

// exports.show = show;

// var create = function (req, res, next) {
//   var title   = validator.trim(req.body.title);
//   title       = validator.escape(title);
//   var tab     = validator.trim(req.body.tab);
//   tab         = validator.escape(tab);
//   var content = validator.trim(req.body.content);

//   // 得到所有的 tab, e.g. ['ask', 'share', ..]
//   var allTabs = config.tabs.map(function (tPair) {
//     return tPair[0];
//   });

//   // 验证
//   var editError;
//   if (title === '') {
//     editError = '标题不能是空的。';
//   } else if (title.length < 5 || title.length > 100) {
//     editError = '标题字数太多或太少。';
//   } else if (!tab || allTabs.indexOf(tab) === -1) {
//     editError = '必须选择一个版块。';
//   } else if (content === '') {
//     editError = '内容不可为空';
//   }
//   // END 验证

//   if (editError) {
//     res.status(422);
//     return res.send({
//       error_msg: editError,
//     });
//   }

//   TopicProxy.newAndSave(title, content, tab, req.user.id, function (err, topic) {
//     if (err) {
//       return next(err);
//     }

//     var proxy = new eventproxy();
//     proxy.fail(next);

//     proxy.all('score_saved', function () {
//       res.send({
//         success: true,
//         topic_id: topic.id,
//       });
//     });
//     UserProxy.getUserById(req.user.id, proxy.done(function (user) {
//       user.score += 5;
//       user.topic_count += 1;
//       user.save();
//       req.user = user;
//       proxy.emit('score_saved');
//     }));

//     //发送at消息
//     at.sendMessageToMentionUsers(content, topic.id, req.user.id);
//   });
// };

// exports.create = create;

// exports.collect = function (req, res, next) {
//   var topic_id = req.body.topic_id;
//   TopicProxy.getTopic(topic_id, function (err, topic) {
//     if (err) {
//       return next(err);
//     }
//     if (!topic) {
//       return res.json({error_msg: '主题不存在'});
//     }

//     TopicCollect.getTopicCollect(req.user.id, topic._id, function (err, doc) {
//       if (err) {
//         return next(err);
//       }
//       if (doc) {
//         res.json({success: true});
//         return;
//       }

//       TopicCollect.newAndSave(req.user.id, topic._id, function (err) {
//         if (err) {
//           return next(err);
//         }
//         res.json({success: true});
//       });
//       UserProxy.getUserById(req.user.id, function (err, user) {
//         if (err) {
//           return next(err);
//         }
//         user.collect_topic_count += 1;
//         user.save();
//       });

//       req.user.collect_topic_count += 1;
//       topic.collect_count += 1;
//       topic.save();
//     });
//   });
// };

// exports.de_collect = function (req, res, next) {
//   var topic_id = req.body.topic_id;
//   TopicProxy.getTopic(topic_id, function (err, topic) {
//     if (err) {
//       return next(err);
//     }
//     if (!topic) {
//       return res.json({error_msg: '主题不存在'});
//     }
//     TopicCollect.remove(req.user.id, topic._id, function (err) {
//       if (err) {
//         return next(err);
//       }
//       res.json({success: true});
//     });

//     UserProxy.getUserById(req.user.id, function (err, user) {
//       if (err) {
//         return next(err);
//       }
//       user.collect_topic_count -= 1;
//       user.save();
//     });

//     topic.collect_count -= 1;
//     topic.save();

//     req.user.collect_topic_count -= 1;
//   });
// };