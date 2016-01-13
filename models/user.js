var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var UserSchema = new Schema({
  password: { type: String },
  email: { type: String},
  user_name:{type:String},
  profile_image_url: {type: String},
  location: { type: String },
  signature: { type: String },
  profile: { type: String },
  avatar: { type: String },
  is_vip: {type: Boolean, default: false},
  score: { type: Number, default: 0 },  //积分
  money: { type: Number, default: 10000 },  //账户余额
  hasBuy:{type:Array}, //已经购买的图集
  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  collect_tag_count: { type: Number, default: 0 },
  collect_topic_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  expire_date:{type: String},
  level: { type: String },
  active: { type: Boolean, default: false },

  receive_reply_mail: {type: Boolean, default: false },
  receive_at_mail: { type: Boolean, default: false },
  retrieve_time: {type: Number},
  retrieve_key: {type: String},
  accessToken: {type: String},
  nickname: {type: String},
  cell_phone: {type: String},
  wx: {type: String},
  QQ: {type: String}
});

UserSchema.index({email: 1}, {unique: true});


mongoose.model('User', UserSchema);
