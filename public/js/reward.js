(function () {
    // 打赏功能
    // 1: 用户点击打赏按钮弹出打赏弹出层
    // 2: 用户填写打赏金额,选择打赏类型,提交
    // 3: 根据打赏类型,如个人账户,输入支付密码,微信支付,弹出支付二维码
    // 4: 用户完成对应操作,调用订单状态接口完成支付
    //=====================


    var css = '<style>.g-layer-wrap,.g-layer-box div{font-family:"Microsoft Yahei"!important;color:#444;font-size:13px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.g-layer-wrap{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.1)}.g-layer-box{position:fixed;left:50%;top:50%;margin-top:-250px;margin-left:-150px;height:400px;width:300px;background-color:#fff;padding:10px}.g-layer-box .u-close{float: right;cursor: pointer;}.g-layer-box h1{font-size:18px;font-weight:normal;text-align:center}.g-layer-box h2{font-size:14px;font-weight:normal}.g-layer-box .u-money,.g-layer-box .u-pay-pwd{margin:20px}.g-layer-box .u-money input,.g-layer-box .u-pay-pwd input{width:200px;height:30px;padding:2px 5px}.g-layer-box .u-pay-pwd input{width:180px}.g-layer-box .u-pay-type{margin:40px 20px}.g-layer-box .u-pay-type ul{list-style:none;padding:0;margin-top:10px;}.g-layer-box .u-pay-type li{float:left;margin-left:10px}.g-layer-box .g-layer-footer{text-align:center}.g-layer-box .u-pay-type:after{content:" ";display:block;height:0;clear:both;visibility:hidden}.u-btn{display:inline-block;padding:6px 20px;background:transparent;cursor:pointer;outline:0;color:#027cff;font-size:14px;border:1px solid #027cff;-moz-border-radius:3px;-webkit-border-radius:3px;-ms-border-radius:3px;border-radius:3px}.u-btn:hover{background-color:#027cff;color:#fff}.g-layer-box .u-mark{text-align:right;margin-top:10px;color:#999}.g-layer-box .u-err-msg{margin:40px 20px;padding:5px;color:#dd6574;font-size:12px}.g-layer-box .u-wxcode{margin-left:10px;width:280px;height:280px}</style>';
    var html1 = '<div class="g-layer-wrap"><div class="g-layer-box"><span class="u-close">X</span><h1>谢谢您的鼓励</h1><div class="u-money"><label>金额&nbsp;:&nbsp;</label><input type="text" id="money" placeholder="单位元"></div><div class="u-pay-type"><h2>支付方式</h2><ul><li><label>个人钱包&nbsp;<input name="pay-type" value="1" type="radio"></label></li><li><label>微信&nbsp;<input name="pay-type" value="2" type="radio"></label></li><li><label>支付宝&nbsp;<input name="pay-type" value="3" type="radio"></label></li></ul></div><div class="g-layer-footer"><button class="u-btn j-reward">下一步</button></div><div class="u-mark"><small>注 : 账户余额(' + PAGECONFIG.money + '元)</small></div><div class="u-err-msg"></div></div></div>';
    var html2 = '<div class="g-layer-wrap"><div class="g-layer-box"><span class="u-close">X</span><h1>个人钱包</h1><div class="u-money"><label>支付金额 : ¥<span class="u-money-amount">0.0</span></label></div><div class="u-pay-pwd"><label>支付密码 :</label><input type="password" placeholder="登录密码"></div><div class="g-layer-footer"><button class="u-btn j-reward-pay">确定支付</button></div><div class="u-err-msg"></div></div></div>';
    var html3 = '<div class="g-layer-wrap"><div class="g-layer-box"><span class="u-close">X</span><h1>微信支付</h1><div class="u-money"><label>支付金额 : ¥<span class="u-money-amount">0.0</span></label></div><img class="u-wxcode" src="" alt="微信扫码支付"><div class="u-mark"><small>注 : 微信扫码支付</small></div></div></div>';

    var $body = $('body');
    var $head = $('head');
    $head.append(css);
    var $html1 = $(html1);
    var $html2 = $(html2);
    var $html3 = $(html3);
    //订单ID
    var orderId;

    function colse($dom) {
        $('.u-close', $dom).click(function () {
            $dom.remove();
        });
    }

    $('#reward').click(function () {
        $body.append($html1);
        colse($html1);
        next($html1);
    });

    //下一步
    function next($dom) {
        var req_url = '/deal/order/action/';
        var $err = $('.u-err-msg', $dom);
        $('.j-reward', $dom).click(function () {
            //打赏的人
            var userId = PAGECONFIG.authorId;
            //打赏金额(单位元)
            var money = $('#money', $dom).val().trim();
            if (!money) {
                return $err.html('请填写金额');
            }
            money = parseFloat(money);
            if (isNaN(money)) {
                return $err.html('请填写正确的金额');
            }
            money = money.toFixed(2);
            //交易方式
            //1：个人钱包,2：微信,3：支付宝,4：个人钱包+微信,5：个人钱包+支付宝
            var type = $('input[name=pay-type]:checked', $dom).val();
            if (!type) {
                return $err.html('请选择支付方式');
            }
            if (type == 3) {
                return $err.html('支付宝支付暂未开通,请使用其他方式');
            }
            req_url += userId + '-' + type + '-2?money=' + money;

            $.get(req_url, function (data) {
                if (data.errorno === 0) {
                    orderId = data.data.id;

                    $html1.remove();
                    if (type == 1) {
                        $('.u-money-amount', $html2).html(money);
                        $body.append($html2);
                        colse($html2);
                        conformPay($html2);
                    } else if (type == 2) {
                        $('.u-money-amount', $html3).html(money);
                        $('.u-wxcode', $html3).attr('src', '/deal/order/pay/' + orderId);
                        $body.append($html3);
                        colse($html3);
                        wxpay($html3);
                    }

                } else if (data.errorno === -2) {
                    //提示登录
                    alert('请先登录');
                } else {
                    $err.html(data.msg);
                }
            });
        });
    }

    //个人钱包支付
    function conformPay($dom) {
        var $err = $('.u-err-msg', $dom);
        $('.j-reward-pay', $dom).click(function () {
            if (!orderId) return $err.html('订单ID获取失败');
            //支付密码
            var pwd = $('input[type="password"]').val();
            if (!pwd) {
                return $err.html('请输入登录密码');
            }
            $.ajax({
                url: '/deal/order/pay/' + orderId,
                data: {pwd: pwd},
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.errorno === 0) {
                        $dom.remove();
                        alert('打赏成功');
                    } else if (data.errorno === -2) {
                        //提示登录
                        alert('未登录');
                    } else {
                        $err.html(data.msg);
                    }
                },
                error: function () {
                    $err.html('网络错误');
                }
            });

        });
    }

    //微信支付
    function wxpay($dom) {
        var _interval = setInterval(function(){
            getOrderStatus(function(){
                clearInterval(_interval);
            });
        }, 1000);
    }

    function getOrderStatus(cb) {
        //查看订单状态
        $.get('/deal/order/' + orderId, function (data) {
            if (data.errorno === 0) {
                //1：成功，2失败,3交易中,4：失效
                switch (data.data.status) {
                    case 1:
                        cb();
                        $dom.remove();
                        alert('打赏成功');
                        break;
                    case 2:
                        cb();
                        $dom.remove();
                        alert('打赏失败');
                        break;
                    case 3:
                        console.log('支付中...');
                        break;
                    case 4:
                        cb();
                        $dom.remove();
                        alert('订单失效');
                        break;
                }
            }
        });
    }
})();