//图片模型


var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var PhotoSchema = new Schema({
  title: { type: String },
  discrib:{type:String},
  author_id: { type: String},
  content:{type:String},
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

});
// AticleSchema.index({title: 1}, {unique: true});
mongoose.model('Photo', PhotoSchema);
