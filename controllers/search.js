var config = require('../config');
var Search = require('../proxy/search.js');


//添加评论
exports.show = function (req, res) {
 
   res.render('search')


};


exports.search = function (req, res) {
 
   var keyword= req.query.keyword;

   console.log(keyword);

   Search.search(keyword,1,function(err,data){

    var _.picker(data,['title','des','author','create'])

       res.render('search',{
        data:
       })


    console.log(data);


   })


};

