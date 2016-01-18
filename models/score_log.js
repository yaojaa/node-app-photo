//积分流水表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ScoreLogSchema = new Schema({
  userId: {type: String},//用户Id
  title: {type: String},//积分名称
  key: {type: String}, //积分唯一标示，不可修改，自己定义积分命名规则如 J001
  score: {type: Number},//积分数
  gainType: {type: Number},//获取积分的类型,0:无限制，1:每天多少次
  gainTimes: {type: Number},//获取积分次数
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  errorno: {type: Number, default: 1},//积分操作是否成功,1；成功，0：失败
  msg: {type: String, default: 'success'}//描述信息，成功：'success',失败：理由
});

ScoreLogSchema.index({userId: 1});
mongoose.model('ScoreLog', ScoreLogSchema);
