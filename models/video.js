//视频模型
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var VideoSchema = new Schema({
  title: { type: String },//标题
  discrib:{type:String},//简介
  cover_url: { type: String},//发布者或作者
  author_id: { type: String},//发布者或作者
  video_url:{type:String}, //视频远程地址
  duration:{type:String}, //时长单位秒
  category:{type:String},
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});
// AticleSchema.index({title: 1}, {unique: true});
mongoose.model('Video', VideoSchema);
