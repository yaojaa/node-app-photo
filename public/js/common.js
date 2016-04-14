//设置一个全局变量
var my = {
    baseImageURL: 'http://img.fengimage.com/'
};

//对ajax请求结果统一处理
my.ajax = function (options) {
    options.type = options.type || 'post';
    options.timeout = options.timeout || 3000;
    options.dataType = options.dataType || 'JSON';
    var success = options.success;
    var error = options.error || function () {};
    options.success = function (data) {
        if (data.errorno >= 0) {
            success(data.data);
        } else {
            error(data.msg);
        }
    };
    options.error = function () {
        error('网络异常，请稍后重试');
    };
    $.ajax(options);
};