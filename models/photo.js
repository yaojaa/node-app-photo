//图片模型


var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var PhotoSchema = new Schema({
  title: { type: String },//相册名称
  discrib:{type:String}, //相册描述
  author_id: { type: String}, //作者
  pictures:{ type: Array},
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

});
// AticleSchema.index({title: 1}, {unique: true});
mongoose.model('Photo', PhotoSchema);
