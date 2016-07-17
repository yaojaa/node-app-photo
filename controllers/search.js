var config = require('../config');
var Search = require('../proxy/search.js');
var _= require('../lib/tools');


//搜索

exports.search = function (req, res) {
 
   var keyword= req.query.keyword || '';

   var has_result=false;

if(keyword){

   Search.search(keyword,1,function(err,data){

    console.log(data);

    if(data.length!==0){


          var aticle_data = data.map(function(item){

                  return  {
                            _id : item._id,
                            update_at : item.update_at,
                            title : item.title.replace(keyword,'<strong class="bg-primary">'+keyword+'</strong>'),
                            author:item.author_id,
                            des:item.des,
                            type: typeof item.pictures!='undefined' ? 'photo':'a'
                        };

          })

              res.render('search',{
                has_result:has_result,
                keyword:keyword,
                data:aticle_data,
                has_result:true,
                is_show:false
               })


     }else{

               res.render('search',{
                has_result:has_result,
                keyword:keyword,
                data:aticle_data,
                has_result:true,
                is_show:false
               })
     }


   })


 }
else{

       res.render('search',{
        is_show:false,
        has_result:false
       })


}



};

