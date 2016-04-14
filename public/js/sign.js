(function () {
    my.error = {
        $el: $('#error-msg'),
        init: function () {
            this.errorHeight = this.$el.outerHeight();
            this.$el.css('left', ($(window).width() - this.$el.width()) / 2).css('top', -this.errorHeight);
            return this;
        },
        show: function (msg) {
            var self = this;
            this.$el.text(msg);
            this.$el.animate({
                top: 0
            }, 500, function () {
                setTimeout(function () {
                    self.$el.animate({
                        top: -self.errorHeight
                    }, 500);
                }, 3000);
            });
        }
    };

    //初始化错误提示信息
    my.error.init();

    //发送验证码挡板
    my.baffle = false;
    //提交挡板
    my.submitBaffle = false;
    my.$emailCode = $('#emailCode');
    my.$signup = $('#signup');
    my.$signon = $('#signon');
    //发送邮件验证码
    my.$emailCode.click(function () {
        if (my.baffle)return;
        my.baffle = true;
        var email = $.trim($('input[name="email"]').val());
        if (!validator.isEmail(email)) {
            my.baffle = false;
            return my.error.show('请输入正确的邮箱');
        }
        var self = this;
        this.disabled = true;
        var timeMark = setTimeout(function () {
            my.baffle = false;
            self.disabled = false;
        }, 30000);
        my.ajax({
            url: 'getMailCode',
            type: 'get',
            data: {email: email},
            success: function () {
                my.error.show('验证码已经发送到邮箱');
            },
            error: function () {
                my.error.show('验证码发送失败');
                my.baffle = false;
                self.disabled = false;
                clearTimeout(timeMark);
            }
        });
    });

    //注册提交
    my.$signup.click(function () {
        if (my.submitBaffle)return;
        my.submitBaffle = true;
        var self = this;
        self.innerHTML = '注册中..';

        var show = function (info) {
            self.innerHTML = '注册';
            my.submitBaffle = false;
            my.error.show(info);
            return false;
        };

        var data = {};
        $('form input').each(function (index, item) {
            item.value = $.trim(item.value);
            data[item.name] = item.value;
            switch (item.name) {
                case 'email' :
                    if (!validator.isEmail(item.value)) {
                        return show('请输入正确的邮箱');
                    }
                    break;
                case 'code' :
                    if (!/^\w{6}$/.test(item.value)) {
                        return show('请输入正确的验证码');
                    }
                    break;
                case 'nickname' :
                    if (item.value.length === 0 || item.value.length > 20) {
                        return show('昵称请限制在2到20个字符之间');
                    }
                    break;
                case 'password' :
                    if (item.value.length < 6) {
                        return show('密码至少6位');
                    }
                    break;
                case 'reg_protocol' :
                    if (!item.checked) {
                        return show('请勾选用户协议');
                    }
                    break;
            }

        });

        if (!my.submitBaffle)return;

        my.ajax({
            url: 'signup',
            type: 'post',
            data: data,
            success: function (ret) {
                window.location = '/login';
            },
            error: function (msg) {
                show(msg);
            }
        });
    });


    //登录提交
    my.$signon.click(function () {
        if (my.submitBaffle)return;
        my.submitBaffle = true;
        var self = this;
        self.innerHTML = '登录..';

        var show = function (info) {
            self.innerHTML = '登录';
            my.submitBaffle = false;
            my.error.show(info);
            return false;
        };

        var data = {};
        $('form input').each(function (index, item) {
            item.value = $.trim(item.value);
            data[item.name] = item.value;
            switch (item.name) {
                case 'email' :
                    if (!validator.isEmail(item.value)) {
                        return show('请输入正确的邮箱');
                    }
                    break;
                case 'password' :
                    if (item.value.length === 0) {
                        return show('请输入密码');
                    }
                    break;
                case 'remember_me' :
                    if (!item.checked) {
                        delete data[item.name];
                    }
                    break;
            }

        });

        if (!my.submitBaffle)return;

        my.ajax({
            url: 'login',
            data: data,
            success: function (ret) {
                window.location = JUMP_URL;
            },
            error: function (msg) {
                show(msg);
            }
        });
    });

})();