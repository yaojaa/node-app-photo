var config = require('../config');
var Search = require('../proxy/search.js');
var _ = require('../lib/tools');


//搜索

exports.search = function(req, res) {

    var keyword = req.query.keyword || '';

    var has_result = false;

    if (keyword) {

        Search.search(keyword, 1, function(err, data) {

            console.log(data);

            if (data.length !== 0) {

                var aticle_data = data.map(function(item) {

                    console.log(item);

                    item.title=typeof item.title!='undefined'?item.title :item.nickname;

                    var type=(function(){

                        if(typeof item.nickname != 'undefined'){
                            return {
                                title:'用户',
                                url:'userspace'
                            }
                        }

                         else if(typeof item.pictures != 'undefined'){
                            return {
                                title:'图集',
                                url:'photo'
                            }
                        }
                        else{

                             return  {
                                title:'文章',
                                url:'a'
                            }

                        }

                       


                    })();

                    console.log(item.nickname)

                    return {
                        _id: item._id, 
                        update_at: item.update_at,
                        title: item.title.replace(keyword, '<strong class="text-danger">' + keyword + '</strong>'),
                        des: item.des,
                        type: type
                    };

                })

                res.render('search', {
                    has_result: has_result,
                    keyword: keyword,
                    data: aticle_data,
                    has_result: true,
                    is_show: false
                })


            } else {

                res.render('search', {
                    has_result: has_result,
                    keyword: keyword,
                    data: aticle_data,
                    has_result: true,
                    is_show: false
                })
            }


        })


    } else {

        res.render('search', {
            is_show: false,
            has_result: false
        })


    }



};
