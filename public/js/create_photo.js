jQuery(function() {
    var $ = jQuery, // just in case. Make sure it's not an other libaray.

        $wrap = $('#uploader'),
        BASE_URL = '/vendor/webuploader/';
    // 图片容器
    $queue = $('<ul class="filelist"></ul>')
        .appendTo($wrap.find('.queueList')),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
        $info = $statusBar.find('.info'),

        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

        // 总体进度条
        $progress = $statusBar.find('.progress').hide(),

        // 添加的文件数量
        fileCount = 0,

        // 添加的文件总大小
        fileSize = 0,

        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        // 所有文件的进度信息，key为file id
        percentages = {},

        supportTransition = (function() {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                'WebkitTransition' in s ||
                'MozTransition' in s ||
                'msTransition' in s ||
                'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;

    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }

    console.info(config.uploadurl);

    // 实例化
    uploader = WebUploader.create({
        pick: {
            id: '#filePicker',
            label: '点击选择图片'
        },
        dnd: '#uploader .queueList',
        paste: document.body,

        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        formData: {
            token: config.token
        },

        // swf文件路径
        swf: BASE_URL + '/js/Uploader.swf',

        disableGlobalDnd: true,

        chunked: true,
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        server: config.uploadurl,
        fileNumLimit: 30,
        fileSizeLimit: 10000 * 1024 * 1024, // 200 M
        fileSingleSizeLimit: 10000 * 1024 * 1024 // 50 M
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: '#filePicker2',
        label: '继续添加'
    });

    uploader.on('uploadSuccess', function(file, res) {
        var pval = $('#pictures').val();
        $('#pictures').val(pval + ',' + res.hash)
    });

    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
        var $li = $('<li id="' + file.id + '">' +
                '<p class="imgWrap"></p>' +
                '<p class="progress"><span></span></p>' +
                '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function(code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('预览中');
            uploader.makeThumb(file, function(error, src) {
                if (error) {
                    $wrap.text('不能预览');
                    return;
                }

                var img = $('<img src="' + src + '">');
                $wrap.empty().append(img);
            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }

        file.on('statuschange', function(cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                $li.off('mouseenter mouseleave');
                $btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                console.log(file.statusText);
                showError(file.statusText);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');

            } else if (cur === 'complete') {

                console.log('complete')

                $li.append('<span class="success"></span>');
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function() {
            $btns.stop().animate({ height: 30 });
        });

        $li.on('mouseleave', function() {
            $btns.stop().animate({ height: 0 });
        });

        $btns.on('click', 'span', function() {
            var index = $(this).index(),
                deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                // use jquery animate to rotation
                // $({
                //     rotation: rotation
                // }).animate({
                //     rotation: file.rotation
                // }, {
                //     easing: 'linear',
                //     step: function( now ) {
                //         now = now * Math.PI / 180;

                //         var cos = Math.cos( now ),
                //             sin = Math.sin( now );

                //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                //     }
                // });
            }


        });

        $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);

        delete percentages[file.id];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function(k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;

        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '',
            stats;

        if (state === 'ready') {
            text = '选中' + fileCount + '张图片，共' +
                WebUploader.formatSize(fileSize) + '。';
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = '已成功上传' + stats.successNum + '张照片，' +
                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '张（' +
                WebUploader.formatSize(fileSize) +
                '），已上传' + stats.successNum + '张';

            if (stats.uploadFailNum) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }

        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                $placeHolder.removeClass('element-invisible');
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass('element-invisible');
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass('element-invisible');
                $('#filePicker2').removeClass('element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $('#filePicker2').addClass('element-invisible');
                $progress.show();
                $upload.text('暂停上传');
                break;

            case 'paused':
                $progress.show();
                $upload.text('继续上传');
                break;

            case 'confirm':
                $progress.hide();
                $upload.text('开始上传').addClass('disabled');

                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                $('#filePicker2').removeClass('element-invisible');
                $upload.text('开始上传').removeClass('disabled');

                stats = uploader.getStats();
                if (stats.successNum) {
                    console.log('上传成功');
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function(file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.id][1] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function(file) {
        fileCount++;
        fileSize += file.size;

        if (fileCount === 1) {
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
        }

        addFile(file);
        setState('ready');
        updateTotalProgress();
    };

    uploader.onFileDequeued = function(file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };

    uploader.on('all', function(type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;

            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;

        }
    });

    uploader.onError = function(code) {
        alert('Eroor: ' + code);
    };

    $upload.on('click', function() {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop();
        }
    });

    $info.on('click', '.retry', function() {
        uploader.retry();
    });

    $info.on('click', '.ignore', function() {
        alert('todo');
    });

    $upload.addClass('state-' + state);
    updateTotalProgress();


    //发布
    var postPicture = function(data) {



        $('#Jpost').removeClass('btn-success').text('loading...').attr('disabled',true);
        $.post(config.apiurl, data, function(res) {

            if (res.errorno == -1) {
                swal({
                    title: '请先登录',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "登录",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function() {
                    location.href = "/login"
                });

            } else if (res.errorno== 0) {

                var photoId=res.data._id;
                   swal({
                    title: '发布成功',
                    type: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "立即查看",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function() {
                    location.href = "/photo/"+photoId
                });

            } else {
                alert(res.msg);
        $('#Jpost').addClass('btn-success').text('发布').attr('disabled',false);

            }


        })
    }




    $('#createForm').validate({

        submitHandler: function(form) {

           // var btn= $(form).find(":submit");
           postPicture($(form).serialize());
           return false

        },

        rules: {
            title: "required",
            pictures: "required",
            category: "required",
            discrib: {
                required: true,
                minlength: 5
            },
        },
        messages: {
            title: "请输入标题",
            pictures: "请上传图片",
            category: "请选择发布类别",
            discrib: {
                required: "请输入作品简介",
                minlength: "至少五个字"
            }

        }

    })


  //如果是编辑页

  //删除已上传的照片

  $('#hasUploadList').on('click','.cancel',function(){
 var currval=$('#pictures').val();

    var curpic= $(this).closest('li').attr('data-name');

    var reg = new RegExp(curpic);

    console.log(reg,'reg')


   var newval=currval.replace(reg,'')


           console.log(newval);

     $('#pictures').val(newval);

    $(this).closest('li').remove();

           console.log($('#pictures').val());






  })

 // var  editPicture = $('#pictures').val();

 // editPicture=editPicture.split(',');

 // console.log('editPicture',editPicture)

 // $.each(editPicture,function(k,v){


 //        addPreview('http://img.fengimage.com/'+v)


 // })

 // function  addPreview(src){

 //    var $li = $('<li id="has' + src + '">' +
 //            '<p class="imgWrap"></p>' +
 //            '</li>'),

 //            $btns = $('<div class="file-panel">' +
 //            '<span class="cancel">删除</span>' +
 //            '<span class="rotateRight">向右旋转</span>' +
 //            '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
 //            $wrap = $li.find('p.imgWrap'),
 //            $info = $('<p class="error"></p>');

 //            $wrap.text('预览中');


 //            var img = $('<img src="' + src + '">');
 //            $wrap.empty().append(img);
 //            $li.appendTo($queue);
 // }









    // $('#Jpost').on('click',postPicture)


});
