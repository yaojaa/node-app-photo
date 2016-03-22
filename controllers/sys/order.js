var Order = require('../../proxy/order');
var User = require('../../proxy/user');
var config = require('../../config');
var validator = require('validator');
var moment = require('moment');
var async = require('async');


exports.page = function (req, res, next) {
    console.log('---------->sys|order');
    var body = req.body;
    var status = body.status;
    var pageNo = body.pageNo;
    var pageSize = body.pageSize;
    var where = {};
    if (status) {
        where['status'] = parseInt(status);
    }
    async.waterfall([function (callback) {
        Order.page(where, {}, {
            pageNo: pageNo, pageSize: pageSize, sort: '-create_at'
        }, callback);
    }], function (err, result) {
        if (err) {
            console.log('查询图集列表出错', err.stack);
            return res.send({status: "001", msg: '系统错误，请稍后重试'});
        }
        result.list = result.list.map(function (item) {
            return {
                id: item._id,
                product_id: item.product_id,
                buy_id: item.buy_id,
                author_id: item.author_id,
                openid: item.openid,
                trading_channel: item.trading_channel,
                price: item.price,
                status: item.status,
                create_at: moment(item.create_at).format('YYYY-MM-DD HH:mm:ss')
            };
        });

        res.send({status: "000", msg: result});
    });

};