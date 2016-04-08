//设置一个全局变量
var my = {
    baseImageURL: 'http://7xobdo.com1.z0.glb.clouddn.com/'
};

//对ajax请求结果统一处理
my.ajax = function (options) {
    options.type = options.type || 'post';
    options.timeout = options.timeout || 3000;
    options.dataType = options.dataType || 'JSON';
    var success = options.success;
    var error = options.error;
    options.success = function (data) {
        if (data.errorno >= 0) {
            success(data.data);
        } else {
            error.apply(this, arguments);
            alert(data.msg);
        }
    };
    options.error = function () {
        if (error && typeof error === 'function') {
            error.apply(this, arguments);
        } else {
            alert('网络异常');
        }
    };
    $.ajax(options);
};