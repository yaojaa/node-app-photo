var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
  product_id: {type: String},//产品ID
  openid: {type: String}, //微信用户ID
  product_num: {type: Number, default: 1},//购买的数量
  type: {type: Number, default: 1},//订单类型1：图片，2：视频
  price: {type: Number, default: 0},//交易的价格，
  status: {type: Number},//交易的状态，1：成功，2失败,3交易中
  fail_msg: {type: String, default: 'ok'},//失败理由
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now}
});

PhotoSchema.index({product_id: 1});
mongoose.model('Order', OrderSchema);