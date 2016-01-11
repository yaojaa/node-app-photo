/**
 * 对response扩展
 * 添加接口函数,接口规则
 * {
 *  errorno:1, //状态吗
 *  msg:'文字提示，成功 失败等'
 *  data:{  //具体返回的数据
 *    item:{},
 *    list:[],
 *    pageNo:1,
 *    count:100,
 *    total:10
 *  }
 * }
 *
 * errorno:状态码，1表示成功，-1表示失败，其它自定义
 * msg:信息显示，内容不确定
 *  如果是字符串可直接显示，
 *  对象用item
 *  数组用list
 *  pageNo:页号
 *  count：总记录数
 *  total: 总页数
 */

var proto = module.exports = function (req, res, next) {
  for (var key in proto) {
    res[key] = proto[key];
  }
  next();
};

proto.fail = function (code, msg) {
  if (msg == null) {
    msg = code;
    code = -1;
  }
  if (msg == null) {
    msg = 'fail';
  }
  this.json({errorno: -1, msg: msg});
};

proto.ok = function (code, msg, obj) {
  if (obj == null) {
    obj = code;
    code = 1;
    msg = 'success';
  }
  this.json({errorno: -1, msg: msg, data: obj});
};
