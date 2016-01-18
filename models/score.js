//用户积分表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ScoreSchema = new Schema({
  userId: {type: String},//用户Id
  today: {type: Date, default: Date.now},//记录今天的日期
  score: {type: Number, default: 0},//积分数
  J_FATUJI: {//图集
    gainTimes: {type: Number, default: 0},//获取的次数
    name: {type: String, default: '图集'}//积分的名称
  },
  J_FAHUIFU: {//发回复
    gainTimes: {type: Number, default: 0},//获取的次数
    name: {type: String, default: '发回复'}//积分的名称
  },
  J_SHOUDAOZAN: {//收到赞
    gainTimes: {type: Number, default: 0},//获取的次数
    name: {type: String, default: '收到赞'}//积分的名称
  },
  J_BEIGUANZHU: {//被关注
    gainTimes: {type: Number, default: 0},//获取的次数
    name: {type: String, default: '被关注'}//积分的名称
  },
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now}
});

ScoreSchema.index({userId: 1}, {unique: true});
mongoose.model('Score', ScoreSchema);
