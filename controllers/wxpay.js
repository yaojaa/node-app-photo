var async = require('async');
var request = require('request');
var crypto = require('crypto');
var Photo = require('../proxy/photo.js');
var Order = require('../proxy/order.js');
var generator = require('../util/randomStatusGenerator');
var qr = require('qr-image');

//公众号APPID
var appid = 'wxf849f8f6fce31880';
var mch_id = '1320356201';
var api_secret = '1f13b03bb6e4445b3fe100a121cc4656';
var qrcode_url = 'weixin://wxpay/bizpayurl';
//统一下单
var unifiedorder_url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

//微信支付回调处理
exports.callback = function (req, res) {

  parseBody(req, function(){

    console.log('------->', req._body);
    res.end('fail');

  });
  return;
  async.waterfall([function (callback) {
    //查询商品信息
    Photo.findPhotoById(productid, callback);
  }, function (product, callback) {
    //生成订单信息，获取订单编号
    if (product == null) {
      callback(new Error('产品不存在'));
    } else {
      generateOrderInfo(product, openid, callback);
    }
  }, function (order, callback) {
    //调用统一下单API，获取交易会话标示（prepay_id）
    unifiedOrder(order, openid, callback);
  }, function (sign, order, callback) {
    requestUnifiedOrder(sign, order, callback);
  }, function (prepay_id, callback) {
    //返回（prepay_id）并让用户完成支付
  }], function (err, user) {

  });
};

//生成订单信息
function generateOrderInfo(product, openid, callback) {
  var order = {
    product_id: product._id,
    openid: openid,
    type: 1,
    price: product.price,
    status: 3
  };
  Order.add(order, callback);
}

//制作支付二维码
exports.makeQRcode = function (req, res) {

  var product_id = req.params.productid;

  Photo.findPhotoById(product_id, function (err, model) {
    if (err || model == null) {
      res.fail('商品不存在');
    } else {
      var time_stamp = Date.now();
      var nonce_str = generator.generate();
      var qrcode = {
        time_stamp: time_stamp,
        product_id: product_id,
        nonce_str: nonce_str,
        appid: appid,
        mch_id: mch_id
      };

      var params = handleParam(qrcode);
      var sign = handleSign(params);
      var url = qrcode_url + '?' + params + '&sign=' + sign;
      console.log('------->' + url);
      var img = qr.image(url, {size: 10});
      res.writeHead(200, {'Content-Type': 'image/png'});
      img.pipe(res);
    }

  });

};


//处理统一下单处理
function unifiedOrder(order, openid, callback) {
  try {
    var nonce_str = generator.generate();
    var order = {
      appid: appid,
      openid: openid,
      mch_id: mch_id,
      is_subscribe: 'Y',
      nonce_str: nonce_str,
      product_id: order._id
    };
    var params = handleParam(order);
    var sign = handleSign(params);
    callback(null, sign, order);
  } catch (e) {
    callback(e);
  }
}

//请求统一下单
function requestUnifiedOrder(sign, order, callback) {
  var data = '<xml>' +
    '<appid>wx2421b1c4370ec43b</appid>' +
    '<attach>支付测试</attach>' +
    '<body>JSAPI支付测试</body>' +
    '<mch_id>10000100</mch_id>' +
    '<nonce_str>1add1a30ac87aa2db72f57a2375d8fec</nonce_str>' +
    '<notify_url>http://wxpay.weixin.qq.com/pub_v2/pay/notify.v2.php</notify_url>' +
    '<openid>oUpF8uMuAJO_M2pxb1Q9zNjWeS6o</openid>' +
    '<out_trade_no>1415659990</out_trade_no>' +
    '<spbill_create_ip>14.23.150.211</spbill_create_ip>' +
    '<total_fee>1</total_fee>' +
    '<trade_type>JSAPI</trade_type>' +
    '<sign>0CB01533B8C1EF103065174F50BCA001</sign>' +
    '</xml>';

  request({url: unifiedorder_url}, function (error, response, body) {
    callback(error, response, body);
  });

}

//处理参数
function handleParam(params) {
  var keys = Object.keys(params).sort();
  var str = '';
  keys.forEach(function (key, index) {
    if (index !== 0) {
      str += '&';
    }
    str += key + '=' + params[key];
  });
  return str;
}

//生成签名
function handleSign(params) {
  var str = params + '&key=' + api_secret;
  var md5 = crypto.createHash('md5');
  md5.update(str);
  str = md5.digest('hex').toUpperCase();
  return str;
}


// 解析BODY
function parseBody(req, callback) {
  var bufferArr = [];
  req.on("data", function (data) {
    bufferArr.push(data);
  };
  req.on("end", function () {
    var postData = Buffer.concat(bufferArr).toString();
    if (postData) req._body = postData;
    callback(null, postData);
  });
}