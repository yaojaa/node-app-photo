var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    nickname: {type: String}, //昵称
    password: {type: String},//密码
    email: {type: String},//邮箱

    is_vip: {type: Boolean, default: false}, //是否VIP
    score: {type: Number, default: 0},  //积分
    money: {type: Number, default: 0},  //账户余额，单位分
    hasBuy: {type: Array}, //已经购买的图集
    topic_count: {type: Number, default: 0}, //主题数量
    reply_count: {type: Number, default: 0}, //回复数量
    userspace_count: {type: Number, default: 0}, //个人空间浏览数量
    fans: {type: Array},//粉丝
    followings: {type: Array},//关注


    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
    expire_date: {type: String},//vip到期时间
    level: {type: String},//等级
    active: {type: Boolean, default: false}, //是否激活，用来锁定用户


    accessToken: {type: String},
    //个人资料
    cell_phone: {type: String},//手机
    wx: {type: String}, //联系微信
    QQ: {type: String}, //联系QQ
    signature: {type: String},//用户签名
    profile: {type: String}, //用户简介
    avatar: {type: String}, //头像
    sex: {type: Number}, //性别，1：男，2：女
    wb_url: {type: String},//用户博客地址
    //第三方
    openid: {type: String},
    qq_user: {type: String},
    wx_user: {type: String},
    wb_user: {type: String}


});

//微信登录或QQ登录时邮箱为空，建立唯一索引添加新用户会报错
//UserSchema.index({email: 1}, {unique: true});


mongoose.model('User', UserSchema);
