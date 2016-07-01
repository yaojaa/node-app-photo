(function () {
    // 打赏功能
    // 1: 用户点击打赏按钮弹出打赏弹出层
    // 2: 用户填写打赏金额,选择打赏类型,提交
    // 3: 根据打赏类型,如个人账户,输入支付密码,微信支付,弹出支付二维码
    // 4: 用户完成对应操作,调用订单状态接口完成支付
    //=====================


    var $body = $('body');
    var $html1 = $($('#template1').html());
    var $html2 = $($('#template2').html());
    var $html3 = $($('#template3').html());
    var $accountMoney = $('#account-money',$html1).html(PAGECONFIG.money);
    //订单ID
    var orderId;
    //支付金额
    var money = 1;

    function colse($dom) {
        $('.u-close', $dom).click(function () {
            $dom.remove();
        });
    }

    //点击打赏按钮
    $('#reward').click(function () {
        $body.append($html1);
        money = 1;
        var $moneyList = $('.money-list li',$html1).click(function(){
            $moneyList.removeClass('active');
            money = $(this).addClass('active').data('money');
            $('input',$money).hide();
        });

        var $money = $('.u-money',$html1).click(function(){
            $moneyList.removeClass('active');
            $('input',$money).show();
            money = false;
        });
        colse($html1);
        next($html1);
    });

    //下一步
    function next($dom) {
        var $err = $('.u-err-msg', $dom);
        $('.j-reward', $dom).click(function () {
            //打赏的人
            var userId = PAGECONFIG.authorId;
            //打赏金额(单位元)
            if(!money) {
                money = $('#money', $dom).val().trim();
            }
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
            if (type == 1 && !PAGECONFIG.isLogin) {
                return $err.html('个人钱包支付,请先登录');
            }
            if (type == 3) {
                return $err.html('支付宝支付暂未开通,请使用其他方式');
            }
            var req_url = '/deal/order/action/'+ userId + '-' + type + '-2?money=' + money;

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
        var _interval = setInterval(function () {
            getOrderStatus($dom, function () {
                clearInterval(_interval);
            });
        }, 1000);
    }

    function getOrderStatus($dom, cb) {
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