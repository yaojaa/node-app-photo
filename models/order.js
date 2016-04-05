var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
    product_id: {type: String},//产品ID
    buy_id: {type: String},//购买者ID
    author_id: {type: String},//图片作者ID
    openid: {type: String}, //微信用户ID
    product_num: {type: Number, default: 1},//购买的数量
    trading_type: {type: Number, default: 1},//交易类型1：购买，2：打赏
    trading_channel: {type: Number, default: 1},//交易渠道， 1：个人钱包， 2：微信，3：支付宝，4：个人钱包+微信，5：个人钱包+支付宝
    type: {type: Number, default: 1},//订单类型1：图片，2：视频
    price: {type: Number, default: 0},//交易的价格，单位是分
    status: {type: Number, default: 3},//交易的状态，1：成功，2失败,3交易中,4：失效（2小时内有效）
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});

OrderSchema.index({product_id: 1});
OrderSchema.index({buy_id: 1});
OrderSchema.index({author_id: 1});
mongoose.model('Order', OrderSchema);