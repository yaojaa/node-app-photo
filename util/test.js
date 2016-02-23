/*
 var generator = require('./randomStatusGenerator');

 console.log(generator.generate());
 console.log(generator.generate('wanglei'));
 generator.baseKey = 'lisi';
 console.log(generator.generate());*/


var str = 'callback( {"client_id":"YOUR_APPID","openid":"12244"} )';
var ret = /\"openid\"\s*:\s*\"(\w+)\"/.exec(str);
console.log(ret[1]);
