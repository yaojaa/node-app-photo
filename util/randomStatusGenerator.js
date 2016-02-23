var crypto = require('crypto');

exports.baseKey = 'fengying';

exports.generate = function (baseKey) {
  baseKey = baseKey ? baseKey : this.baseKey;
  var key = baseKey + ':' + parseInt(Math.random() * 10000) + ':' + Date.now();
  var md5 = crypto.createHash('md5');
  md5.update(key);
  return md5.digest('hex')
};