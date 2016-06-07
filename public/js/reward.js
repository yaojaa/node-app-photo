(function () {
    // 打赏功能
    // 1: 用户点击打赏按钮弹出打赏弹出层
    // 2: 用户填写打赏金额,选择打赏类型,提交
    // 3: 根据打赏类型,如个人账户,输入支付密码,微信支付,弹出支付二维码
    // 4: 用户完成对应操作,调用订单状态接口完成支付
    //=====================

    var req_url = '/deal/order/action/';
    var orderId;
    $('.j-reward').click(function () {
        //打赏的人
        var userId = 'sssssss';
        //打赏金额(单位元)
        var money = 1.5;
        //交易方式
        //1：个人钱包,2：微信,3：支付宝,4：个人钱包+微信,5：个人钱包+支付宝
        var type = 1;
        req_url += userId + '-' + type + '-2?money=' + money;
        $.get(req_url, function (data) {
            if (data.errorno === 1) {
                orderId = data.id;
            }
        });
    });

    $('.j-reward-pay').click(function () {
        if (!orderId) return;
        //支付密码
        var pwd = '';
        $.ajax({
            url: '/deal/order/pay/' + orderId,
            data: {pwd:pwd},
            type: 'get',
            success: function(){

            }
        });

    });

}())();