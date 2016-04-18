/**
 * config
 */

var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,

    get mini_assets() {
        return !this.debug;
    }, // 是否启用静态文件的合并压缩，详见视图中的Loader

    name: '风影', // 社区名字
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
        ['/about', '关于']
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
    //db: 'mongodb://127.0.0.1:27017/photocms',
    db: 'mongodb://123.56.230.118:27017/photocms',

    session_secret: 'sdasd8sdujja', // 务必修改
    auth_cookie_name: 'manyingapp',

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

    //随机背景图片

    random_bg_arr:[
        'https://drscdn.500px.org/photo/144702359/m%3D2048/139f0f1fc44f5d81fb235834a121fe68',
        'https://drscdn.500px.org/photo/146425097/q%3D80_m%3D2000/ce971fa31c530790a4c5d8c54581483d',
        'https://drscdn.500px.org/photo/146345077/q%3D80_m%3D2000/c827e3cfec775a113e289cb48013709a'
    ],


    // admin 可删除话题，编辑标签，设某人为达人
    admins: {'yaojaa@vip.qq.com': true},
    avatar: 'http://7xrf0p.com1.z0.glb.clouddn.com/avatar.png', //默认头像地址
    baseImageURL: 'http://7xobdo.com1.z0.glb.clouddn.com/', //头像地址
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
        'uploadURL': 'http://upload.qiniu.com',
        'ACCESS_KEY': 'QRyit6Y4od3SdD5FC1cxIQH2sCO-PCw3OByFY11X',
        'SECRET_KEY': 'gv7AX5isj_8MrSlFRqCE8UarPeNqkvrZWJ78Kyez',
        'Bucket_Name': 'photo',
        'Uptoken_Url': '/uptoken',
        'Domain': 'http://img.fengimage.com'
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
    category: [
        {name: 'art', text: '风光'},
        {name: 'street', text: '街拍'},
        {name: 'travel', text: '人像'},
        {name: 'fashion', text: '时尚'}
    ],

    //视频分类

    video_category: [
        {name: 'street', text: '电影'},
        {name: 'travel', text: '电视剧'},
        {name: 'fashion', text: '娱乐节目'},
        {name: 'food', text: '美食'},
        {name: 'animals', text: '动物'},
        {name: 'art', text: '搞笑'}
    ],

    // 极光推送
    jpush: {
        appKey: 'YourAccessKeyyyyyyyyyyyy',
        masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
        isDebug: false,
    },

    //积分规则,score：每次获取的积分数，gainType：获取的类型，0无限制，1：每天多少次，gainTimes：每天多少次
    score: {
        //发图集
        'J_FATUJI': {
            title: '发图集',
            score: 1, //每次获取的积分
            gainType: 0
        },
        //发回复
        'J_FAHUIFU': {
            title: '发回复',
            score: 2,
            gainType: 1,
            gainTimes: 1
        },
        //收到赞
        'J_SHOUDAOZAN': {
            title: '收到赞',
            score: 3, //每次获取的积分
            gainType: 1,
            gainTimes: 2
        },
        //被关注
        'J_BEIGUANZHU': {
            title: '被关注',
            score: 4, //每次获取的积分
            gainType: 1,
            gainTimes: 3
        }
    },

    create_post_per_day: 1000, // 每个用户一天可以发的主题数
    create_reply_per_day: 1000, // 每个用户一天可以发的评论数
    visit_per_day: 1000, // 每个 ip 每天能访问的次数
    nav_list: [ //导航
        {name: '首页', url: '/'},
        {name: '街拍', url: '/street'},
        {name: '旅行', url: '/travel'},
        {name: '时尚', url: '/fashion'},
        {name: '美食', url: '/food'},
        {name: '动物', url: '/animals'}
    ],
    weibo: {
        appid: '4167160283',
        secret: 'e554402f753bd32b1c165d65dcb8dc31',
        redirect_uri: 'http://www.fengimage.com/weibo/callback',
        scope: 'all',
        getUserInfoURL: 'https://api.weibo.com/2/users/show.json',
        accessTokenURL: 'https://api.weibo.com/oauth2/access_token',
        qrconnectURL: 'https://api.weibo.com/oauth2/authorize'
        },
    qq: {
        appid: '101294710',
        appkey: 'c732cfbb3813d9473c32522e6243b7eb',
        redirect_uri: 'http://www.fengimage.com/qq/callback',
        scope: 'get_user_info',
        getUserInfoURL: 'https://graph.qq.com/user/get_user_info',
        accessTokenURL: 'https://graph.qq.com/oauth2.0/token',
        authorizeURL: 'https://graph.qq.com/oauth2.0/authorize',
        getOpenIDURL: 'https://graph.qq.com/oauth2.0/me'
    },
    wx: {
        appid: 'wxfaca66b0a27a3ab2',
        secret: '6fc3ee057a59ee751ba5987e06925e68',
        redirect_uri: 'http://www.fengimage.com/wechat/callback',
        scope: 'snsapi_login',
        getUserInfoURL: 'https://api.weixin.qq.com/sns/userinfo',
        accessTokenURL: 'https://api.weixin.qq.com/sns/oauth2/access_token',
        qrconnectURL: 'https://open.weixin.qq.com/connect/qrconnect'
    },
    wxpay: {
        appid: 'wxf849f8f6fce31880',
        mch_id: '1320356201',
        api_secret: '1f13b03bb6e4445b3fe100a121cc4656',
        qrcode_url: 'weixin://wxpay/bizpayurl',
        unifiedorder_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder'
    },
    alipay: {}
};

module.exports = config;
