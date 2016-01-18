//图片模型


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PhotoSchema = new Schema({
  title: {type: String},//相册名称
  discrib: {type: String}, //相册描述
  author_id: {type: String}, //作者
  pictures: {type: Array},
  category: {type: String},
  price: {type: Number, default: 0},
  browse_cnt: {type: Number, default: 0},//图集被点击浏览的次数
  like_cnt: {type: Number, default: 0},//图集被点赞的次数
  comment_cnt: {type: Number, default: 0},//图集被评论的次数
  trade_cnt: {type: Number, default: 0},//图集被购买的次数
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
});
PhotoSchema.index({author_id: 1});
mongoose.model('Photo', PhotoSchema);
