/**
 * 对response扩展
 * 添加接口函数,接口规则
 * {
 *  status:1,
 *  msg:{
 *    item:{},
 *    list:[],
 *    pageNo:1,
 *    count:100,
 *    total:10
 *  }
 * }
 *
 * status:状态码，1表示成功，-1表示失败，其它自定义
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

proto.fail = function (code, obj) {
  if (obj == null) {
    obj = code;
    code = -1;
  }
  if (obj == null) {
    obj = 'fail';
  }
  this.json({status: -1, msg: obj});
};

proto.ok = function (code, obj) {
  if (obj == null) {
    obj = code;
    code = 1;
  }
  if (obj == null) {
    obj = 'ok';
  }
  this.json({status: 1, msg: obj});
};
