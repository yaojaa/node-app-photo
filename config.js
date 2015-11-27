/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: 'Nodeclub', // 社区名字
  description: 'CNode：Node.js专业中文社区', // 社区的描述
  keywords: 'nodejs, node, express, connect, socket.io',

  // 添加到 html head 中的信息
  site_headers: [
    '<meta name="author" content="EDP@TAOBAO" />'
  ],
  site_logo: '/public/images/cnodejs_light.svg', // default is `name`
  site_icon: '/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    [ '/about', '关于' ]
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名
  // 社区的域名
  host: 'localhost',
  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: '',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: '',

  // mongodb 配置
  db: 'mongodb://1.93.14.48:27017/cms',
  session_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // 务必修改
  auth_cookie_name: 'node_club',

  // 程序运行的端口
  port: 3000,

  // 图片列表显示数量
  list_photo_count: 6,
 // 视频列表显示数量
  list_video_count: 10,


  // 邮箱配置
  mail_opts: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'club@126.com',
      pass: 'club'
    }
  },



  // admin 可删除话题，编辑标签，设某人为达人
  admins: { user_login_name: true },

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback'
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: true,

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  // 下面两个配置都是文件上传的配置

  // 7牛的access信息，用于文件上传
  qn_access: {
    // accessKey: 'your access key',
    // secretKey: 'your secret key',
    // bucket: 'your bucket name',
    // domain: 'http://your qiniu domain',
    // // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
    // // 如果在国内，此项请留空
    // uploadURL: 'http://xxxxxxxx',
    'ACCESS_KEY': 'dgJKO74XfcnDumOtIaKqJmNZNB9iBLXOLbC2sNTo',
    'SECRET_KEY': 'ITVzXH5yOQhtSLEjeF4uc4SkX4DhCfEYQVKBpXgT',
    'Bucket_Name': 'nodeyuese',
    'Uptoken_Url': '/uptoken',
    'Domain': 'http://7xobdo.com1.z0.glb.clouddn.com'
  },



  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  // 版块
  tabs: [
    ['share', '分享'],
    ['ask', '问答'],
    ['job', '招聘'],
  ],

  //分类
  category:[
    {name:'street', text:'街拍'},
    {name:'travel', text:'旅行'},
    {name:'fashion',text: '时尚'},
    {name:'food', text:'美食'},
    {name:'animals',text: '动物'},
    {name:'art', text:'艺术'}
  ],

  //视频分类

  video_category:[
    {name:'street', text:'电影'},
    {name:'travel', text:'电视剧'},
    {name:'fashion',text: '娱乐节目'},
    {name:'food', text:'美食'},
    {name:'animals',text: '动物'},
    {name:'art', text:'搞笑'}
  ],

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

module.exports = config;
