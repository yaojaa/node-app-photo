(function () {

    var utils = UM.utils,
        browser = UM.browser,
        Base = {
        //loading 图片
        loadingIconHtml:'<img src="data:image/gif;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==">',
        checkURL: function (url) {
            if(!url)    return false;
            url = utils.trim(url);
            if (url.length <= 0) {
                return false;
            }
            if (url.search(/http:\/\/|https:\/\//) !== 0) {
                url += 'http://';
            }

            url=url.replace(/\?[\s\S]*$/,"");

            //有的地址不一定是扩展名结尾

            // if (!/(.gif|.jpg|.jpeg|.png)$/i.test(url)) {
            //     return false;
            // }
            return url;
        },
        getAllPic: function (sel, $w, editor) {
            var me = this,
                arr = [],
                $imgs = $(sel, $w).find('img');

            $.each($imgs, function (index, node) {
                $(node).removeAttr("width").removeAttr("height");

//                if (node.width > editor.options.initialFrameWidth) {
//                    me.scale(node, editor.options.initialFrameWidth -
//                        parseInt($(editor.body).css("padding-left"))  -
//                        parseInt($(editor.body).css("padding-right")));
//                }

                return arr.push({
                    _src: node.src,
                    src: node.src
                });
            });

            return arr;
        },
        scale: function (img, max, oWidth, oHeight) {
            var width = 0, height = 0, percent, ow = img.width || oWidth, oh = img.height || oHeight;
            if (ow > max || oh > max) {
                if (ow >= oh) {
                    if (width = ow - max) {
                        percent = (width / ow).toFixed(2);
                        img.height = oh - oh * percent;
                        img.width = max;
                    }
                } else {
                    if (height = oh - max) {
                        percent = (height / oh).toFixed(2);
                        img.width = ow - ow * percent;
                        img.height = max;
                    }
                }
            }

            return this;
        },
        close: function ($img) {


            $img.css({
                top: ($img.parent().height() - $img.height()) / 2,
                left: ($img.parent().width()-$img.width())/2
            }).prev().on("click",function () {

                if ( $(this).parent().remove().hasClass("edui-image-upload-item") ) {
                    //显示图片计数-1
                    Upload.showCount--;
                    Upload.updateView();
                }

            });

            return this;
        },
        createImgBase64: function (img, file, $w) {
            if (browser.webkit) {
                //Chrome8+
                img.src = window.webkitURL.createObjectURL(file);
            } else if (browser.gecko) {
                //FF4+
                img.src = window.URL.createObjectURL(file);
            } else {
                //实例化file reader对象
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.src = this.result;
                    $w.append(img);
                };
                reader.readAsDataURL(file);
            }
        },
        callback: function (editor, $w, url, state) {

            if (state == "SUCCESS") {
                //显示图片计数+1
                Upload.showCount++;

                var $img = $("<img src='" + editor.options.imagePath +'/'+ url + "' class='edui-image-pic'  />"),
                    $item = $("<div class='edui-image-item edui-image-upload-item'><div class='edui-image-close'></div></div>").append($img);

                if ($(".edui-image-upload2", $w).length < 1) {
                    $(".edui-image-content", $w).append($item);

                    Upload.render(".edui-image-content", 2)
                        .config(".edui-image-upload2");
                } else {
                    $(".edui-image-upload2", $w).before($item).show();
                }

                $img.on("load", function () {
                    Base.scale(this, 120);
                    Base.close($(this));
                    $(".edui-image-content", $w).focus();
                });

            } else {
                currentDialog.showTip( state );
                window.setTimeout( function () {

                    currentDialog.hideTip();

                }, 3000 );
            }

            Upload.toggleMask();

        }
    };

    /*
     * 本地上传
     * */

    var Upload = {
        showCount: 0,
        uploadTpl: '<div class="edui-image-upload%%">' +
            '<span class="edui-image-icon"></span>' +
            '<form class="edui-image-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input style=\"filter: alpha(opacity=0);\" class="edui-image-file" type="file" hidefocus name="upfile" multiple="multiple" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/>' +
            '</form>' +
            '<div id="progressbar"><div class="progress-label"></div></div>'+
            '</div>',
        init: function (editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;
            me.render(".edui-image-local", 1);
            me.config(".edui-image-upload1");
            me.submit();
            //me.drag();

            $(".edui-image-upload1").hover(function () {
                $(".edui-image-icon", this).toggleClass("hover");
            });

            if (!(UM.browser.ie && UM.browser.version <= 9)) {
                $(".edui-image-dragTip", me.dialog).css("display", "block");
            }


            return me;
        },
        //获取七牛token
        getToken:!function(callback){
            var me=this;
            $.get('/uptoken',function(res){
               Upload.getToken = res.uptoken
            })
        }(),
        render: function (sel, t) {
            var me = this;
            $(sel, me.dialog).append($(me.uploadTpl.replace(/%%/g, t)));
            return me;
        },
        config: function (sel) {
            var me = this,
            url=me.editor.options.imageUrl;
            url=url + (url.indexOf("?") == -1 ? "?" : "&") + "editorid="+me.editor.id;//初始form提交地址;
            $("form", $(sel, me.dialog)).attr("action", url);
            return me;
        },
        Qiniu_getList:function(){

        	$.post('http://7xrf0p.com2.z0.glb.clouddn.com',{'bucket':'photo','Authorization':Upload.getToken},function(res){

        		console.log(res)

        	})



        },

         //ajax上传到七牛
        Qiniu_upload :function(f, token, key) {
            var me=this;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', me.editor.getOpt('imageUrl'), true);
            var formData, startDate;
            formData = new FormData();
            if (key !== null && key !== undefined) formData.append('key', key);
            formData.append('token', token);
            formData.append('file', f);
            var taking;
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var nowDate = new Date().getTime();
                    taking = nowDate - startDate;
                    var x = (evt.loaded) / 1024;
                    var y = taking / 1000;
                    var uploadSpeed = (x / y);
                    var formatSpeed;
                    if (uploadSpeed > 1024) {
                        formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
                    } else {
                        formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
                    }
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                     me.toggleMask('正在上传'+f.name+'上传进度：'+percentComplete+'% 速度：' + formatSpeed);
                }
            }, false);

            xhr.onreadystatechange = function(response) {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                    var blkRet = JSON.parse(xhr.responseText);
                    $("#dialog").html(xhr.responseText);
                    me.uploadComplete(blkRet)
                } else if (xhr.status != 200 && xhr.responseText) {

                }
            };
            startDate = new Date().getTime();
            $("#progressbar").show();
            xhr.send(formData);
        },

        uploadComplete: function(r){
            var me = this;
            try{
                var json = r;
                Base.callback(me.editor, me.dialog, json.hash, 'SUCCESS');
            }catch (e){
                var lang = me.editor.getLang('image');
                Base.callback(me.editor, me.dialog, '', (lang && lang.uploadError) || 'Error!');
            }
        },
        submit: function (callback) {

            var me = this;

            $(me.dialog).undelegate( ".edui-image-file", "change.a");

            $(me.dialog).delegate( ".edui-image-file", "change.a", function ( e ) {

                var files=this.files;
                me.toggleMask(Base.loadingIconHtml);
                $.each(files,function(k,file){
                   me.Qiniu_upload(file,me.getToken)
                })


            });

            return me;
        },
        //更新input
        updateInput: function ( inputField ) {

            $( ".edui-image-file", this.dialog ).each( function ( index, ele ) {

                ele.parentNode.replaceChild( inputField.cloneNode( true ), ele );

            } );

        },
        //更新上传框
        updateView: function () {

            if ( Upload.showCount !== 0 ) {
                return;
            }

            $(".edui-image-upload2", this.dialog).hide();
            $(".edui-image-dragTip", this.dialog).show();
            $(".edui-image-upload1", this.dialog).show();

        },
        drag: function () {
            var me = this;
            //做拽上传的支持
            if (!UM.browser.ie9below) {
                me.dialog.find('.edui-image-content').on('drop',function (e) {

                    //获取文件列表
                    var fileList = e.originalEvent.dataTransfer.files;
                    var img = document.createElement('img');
                    var hasImg = false;
                    $.each(fileList, function (i, f) {
                        if (/^image/.test(f.type)) {
                            //创建图片的base64
                            Base.createImgBase64(img, f, me.dialog);

                            var xhr = new XMLHttpRequest();
                            xhr.open("post", me.editor.getOpt('imageUrl') + "?type=ajax", true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                            //模拟数据
                            var fd = new FormData();
                            fd.append(me.editor.getOpt('imageFieldName'), f);

                            xhr.send(fd);
                            xhr.addEventListener('load', function (e) {
                                var r = e.target.response, json;
                                me.uploadComplete(r);

                                if (i == fileList.length - 1) {
                                    $(img).remove()
                                }
                            });
                            hasImg = true;
                        }
                    });
                    if (hasImg) {
                        e.preventDefault();
                        me.toggleMask("Loading....");
                    }

                }).on('dragover', function (e) {
                        e.preventDefault();
                    });
            }
        },
        toggleMask: function (html) {
            var me = this;

            var $mask = $(".edui-image-mask", me.dialog);
            if (html) {
                if (!(UM.browser.ie && UM.browser.version <= 9)) {
                    $(".edui-image-dragTip", me.dialog).css( "display", "none" );
                }
                $(".edui-image-upload1", me.dialog).css( "display", "none" );
                $mask.addClass("edui-active").html(html);
            } else {

                $mask.removeClass("edui-active").html();

                if ( Upload.showCount > 0 ) {
                    return me;
                }

                if (!(UM.browser.ie && UM.browser.version <= 9) ){
                    $(".edui-image-dragTip", me.dialog).css("display", "block");
                }
                $(".edui-image-upload1", me.dialog).css( "display", "block" );
            }

            return me;
        }
    };

    /*
     * 网络图片
     * */
    var NetWork = {};

    var $tab = null,
        currentDialog = null,
        hasIntEvt=false;
    //插入图片的模版
    UM.registerWidget('image', {
        tpl: "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=image_url%>image.css\">" +
            "<div class=\"edui-image-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item edui-active\"><a data-context=\".edui-image-local\" class=\"edui-tab-text\"><%=lang_tab_local%></a></li>" +
            "<li  class=\"edui-tab-item\"><a data-context=\".edui-image-JimgSearch\" class=\"edui-tab-text\">在线管理</a></li>" +
            "</ul>" +
            "<div class=\"edui-tab-content\">" +
            "<div class=\"edui-image-local edui-tab-pane edui-active\">" +
            "<div class=\"edui-image-content\"></div>" +
            "<div class=\"edui-image-mask\"></div>" +
            "<div class=\"edui-image-dragTip\">点击这里选择图片</div>" +
            "</div>" +
            "<div class=\"edui-image-JimgSearch edui-tab-pane\">" +
            "<div class=\"edui-image-searchBar\">" +
            "<table><tr><td><input class=\"edui-image-searchTxt\" type=\"text\"></td>" +
            "<td><div class=\"edui-image-searchAdd\"><%=lang_btn_add%></div></td></tr></table>" +
            "</div>" +
            "<div class=\"edui-image-searchRes\"></div>" +
            "</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor, $dialog) {
            var lang = editor.getLang('image')["static"],
                opt = $.extend({}, lang, {
                    image_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/image/'
                });

            Upload.showCount = 0;

         

            if (lang) {
                var html = $.parseTmpl(this.tpl, opt);
            }

            currentDialog = $dialog.edui();
                this.root().html(html);

        },
        initEvent: function (editor, $w) {

            $tab = $.eduitab({selector: ".edui-image-wrapper"})
                .edui().on("beforeshow", function (e) {
                    e.stopPropagation();
                });

            Upload.init(editor, $w);

            setTimeout(function(){
            	Upload.Qiniu_getList()
            },4000)

        },
        buttons: {
            'ok': {
                exec: function (editor, $w) {
                    var  sel = ".edui-image-content";
                    var list = Base.getAllPic(sel, $w, editor);
                    editor.execCommand('insertimage', list);
                }
            },
            'cancel': {}
        },
        width: 700,
        height: 408
    }, function (editor, $w, url, state) {
        Base.callback(editor, $w, url, state)
    })
})();

