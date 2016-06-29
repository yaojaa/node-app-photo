var config = require('../config');
var Aticle = require('../proxy/aticle.js');
var validator = require('validator');
var eventproxy = require('eventproxy');
var moment = require('moment');
var xss = require('xss');
var _=require('../lib/tools.js')


//findOnePage
exports.showAticleList = function (req, res) {

    var page = req.query.p ? parseInt(req.query.p) : 1;

    Aticle.findOnePage(page, function (err, lists, count) {

        if (err) {
            return (err);
        }

    //正则提取图片路径
    function getImgSrc(str){
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=['"]?([^'"]*)['"]?/i;
        var arr = str.match(imgReg);
        if(arr==null){
            return 'nopic'
        }

        for (var i = 0; i < arr.length; i++) {
            var src = arr[i].match(srcReg);
            if(src[1]){
            return (src[1])
            }else{
                 return 'nopic'
            }
        }

        }

        lists = lists.map(function(item){
            return {
                _id : item._id,
                update_at : moment(item.update_at).format('YYYY-MM-DD'),
                title : item.title,
                content : item.content,
                thumb:getImgSrc(item.content),
                author:item.author,
                des:item.des
            };
        });

        console.log(lists)


        res.render('aticle', {
            page: page,
            aticles: lists,
            prev: 'p=' + parseInt(page - 1),
            next: 'p=' + parseInt(page + 1),
            count: count,
        })


    })
};

exports.showCreate = function (req, res) {

    res.render('create-aticle', {
        user: req.session.user,
        Domain: config.qn_access.Domain,
        uploadURL: config.qn_access.uploadURL
    })

}

exports.create = function (req, res) {

    var title = xss(validator.trim(req.body.title));
    var content = xss(validator.trim(req.body.content));
    var authorId = req.session.user._id ;

    if(!authorId){

                res.render('create-aticle', {success: '请先登录'});
                return

    }


    Aticle.newAndSave(title, content, authorId, function (err) {

        if (err) {
            return next(err);
        }
        res.render('create-aticle', {success: '发布成功！'});

    })

};


exports.showDetail = function (req, res) {
    var _id = req.params._id;
    Aticle.findOneAticle(_id, function (err, doc) {


        var aticle=_.pick(doc,['_id','update_at','title','content','author'])


        res.render('aticle-view', {
            aticle: aticle
        })


    })


}


exports.delAticleById = function (req, res) {
    var id = req.body.id;
    Aticle.delAticleById(id, function () {

    })
}


