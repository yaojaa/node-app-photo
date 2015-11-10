//文章模型

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var AticleSchema = new Schema({
  name: { type: String },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  catygory:


});
// AticleSchema.index({title: 1}, {unique: true});
mongoose.model('Aticle', AticleSchema);
