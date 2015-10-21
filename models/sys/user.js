var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var UserSchema = new Schema({
  password: { type: String },
  login_name: { type: String},
  create_id: { type: String },
  create_at: { type: Date, default: Date.now },
  update_id:{ type:String},
  update_at: { type: Date, default: Date.now },
  login_time: { type: Date },
  last_login_time: { type: Date },
  login_count: {type: Number, default: 0},
  status: {type: Number, default: 1}
});

UserSchema.index({login_name: 1}, {unique: true});

mongoose.model('SysUser', UserSchema);
