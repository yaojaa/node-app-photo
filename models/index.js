var mongoose = require('mongoose');
var config = require('../config');


mongoose.set('debug', true);

mongoose.connect(config.db, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
  console.log('数据库连接成功...')
});

// models
require('./user');
require('./aticle');
require('./photo');
require('./video');
require('./score');
require('./score_log');
require('./comment');
require('./money_log');
require('./money_log');
require('./order');

// require('./topic_collect');
// require('./message');


// sys
require('./sys/user');

exports.User = mongoose.model('User');
exports.Aticle = mongoose.model('Aticle');
exports.Photo = mongoose.model('Photo');
exports.Video = mongoose.model('Video');
exports.Score = mongoose.model('Score');
exports.ScoreLog = mongoose.model('ScoreLog');
exports.Comment = mongoose.model('Comment');
exports.MoneyLog = mongoose.model('MoneyLog');
exports.Order = mongoose.model('Order');


// exports.Reply        = mongoose.model('Reply');
// exports.TopicCollect = mongoose.model('TopicCollect');
// exports.Message      = mongoose.model('Message');

//管理员
exports.SysUser = mongoose.model('SysUser');
