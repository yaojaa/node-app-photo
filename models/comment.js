//评论表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
  userId: {type: String},//用户Id
  replyId: {type: String},//回复人ID
  belongId: {type: String},//评论所属ID
  content: {type: String},//回复内容
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now}
});

CommentSchema.index({belongId: 1});
mongoose.model('Comment', CommentSchema);
