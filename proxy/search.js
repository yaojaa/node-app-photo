var models  = require('../models');
var Aticle    = models.Aticle;
var Photo    = models.Photo;
var async = require('async');



//搜索返回
exports.search=function(keyword,page,callback){

var reg=new RegExp(keyword,'i');


    async.parallel({
            one: function (callback) {
              Aticle.find({title:reg})
				.sort('-create_at')
				.exec(callback)
            },
            two: function (callback) {

            	 Photo.find({title:reg})
				.sort('-create_at')
				.exec(callback)
            }
        },
        function (err, results) {

        	console.log('results',results)

            var list = results.one.concat(results.two);

            callback(null, list);

        });




	
};

