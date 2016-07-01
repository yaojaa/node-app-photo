var config = require('../config');
var Search = require('../proxy/search.js');
var _= require('../lib/tools');


//添加评论
exports.show = function (req, res) {
 
   res.render('search')


};


exports.search = function (req, res) {
 
   var keyword= req.query.keyword;


   Search.search(keyword,1,function(err,data){


    var aticle_data = data.map(function(item){

      return  {
                _id : item._id,
                update_at : item.update_at,
                title : item.title.replace(keyword,'<strong class="bg-primary">'+keyword+'</strong>'),
                author:item.author_id,
                des:item.des
            };

    })

       res.render('search',{
        has_result:true,
        keyword:keyword,
        data:aticle_data
       })

         console.log(aticle_data);


   })


};

