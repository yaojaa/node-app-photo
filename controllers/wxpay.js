var async = require('async');

//公众号APPID
var appid = 'wxf849f8f6fce31880';
var mch_id = '1320356201';


//微信支付回调处理
exports.callback = function (req, res) {
  //商品ID
  req.params.productid;
  //用户openID
  req.params.openid;

  async.waterfall([function (callback) {
    //查询商品信息
  }, function (response, body, callback) {
    //生成订单信息，获取订单编号
  }, function (user, callback) {
    //调用统一下单API，获取交易会话标示（prepay_id）
  }, function (user, callback) {
    //返回（prepay_id）并让用户完成支付
  }], function (err, user) {

  });
};

//查询商品信息
function queryProductById(productid, callback) {

}

//生成订单信息
function generateOrderInfo(productid, callback) {

}

function makeQRcode(){
  var time_stamp = Date.now();
  var product_id = '';
  var url = 'weixin：//wxpay/bizpayurl?sign=XXXXX&appid=XXXXX&mch_id=XXXXX&product_id=XXXXXX&time_stamp=XXXXXX&nonce_str=XXXXX';
}