//充值流水表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MoneyLogSchema = new Schema({
  userId: {type: String},//用户Id
  money: {type: Number},//充值金额
  type: {type: Number},//充值类型，0：支付宝，1：微信
  response: {type: String},//支付宝或微信相应的信息
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  errorno: {type: Number, default: 1},//积分操作是否成功,1；成功，0：失败
  msg: {type: String, default: 'success'}//描述信息，成功：'success',失败：理由
});

MoneyLogSchema.index({userId: 1});
mongoose.model('MoneyLog', MoneyLogSchema);
