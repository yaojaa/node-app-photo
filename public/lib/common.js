jQuery.extend({
  intiAlert: function (cnt, dom, cls, time, callback) {
    time = time || 3000;
    cls = cls || 'info';
    dom = dom || 'body';
    var $html = $('<div class="alert ' + cls + ' alert-fixed" role="alert">' + cnt + '</div>');
    var msie = navigator.userAgent.toLowerCase().indexOf("msie") > -1;
    if (msie) {
      $html = $('<div class="alert ' + cls + ' alert-fixed-ie" role="alert">' + cnt + '</div>');
    }
    $(dom).prepend($html);
    setTimeout(function () {
      $html.remove();
      if (callback && typeof callback == 'function') {
        callback();
      }
    }, time);
  },
  info: function (cnt, time, dom, callback) {
    jQuery.intiAlert(cnt, dom, 'alert-info', time, callback);
  },
  success: function (cnt, time, dom, callback) {
    jQuery.intiAlert(cnt, dom, 'alert-success', time, callback);
  },
  warning: function (cnt, time, dom, callback) {
    jQuery.intiAlert(cnt, dom, 'alert-warning', time, callback);
  },
  danger: function (cnt, time, dom, callback) {
    jQuery.intiAlert(cnt, dom, 'alert-danger', time, callback);
  }
});

var CMS = {
  $body: $('body'),
  $loading: $('<div id="loading" class="loading"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>'),
  url: 'http://127.0.0.1:3000',
  ajax: function (obj) {
    CMS.$body.prepend(CMS.$loading);
    $.ajax({
      url: CMS.url + obj.url,
      data: obj.data,
      type: "POST",
      dataType: "json",
      timeout: "30000",
      success: function (data) {
        try {
          if (data.status == "000") {
            obj.success(data);
          } else if (data.status == "002") {
            window.location = '/sys/login';
          } else {
            $.danger(data.msg);
          }
        } catch (e) {
          $.warning('数据解析出错');
        }
        CMS.$loading.remove();
      },
      error: function (error) {
        CMS.$loading.remove();
        $.warning('网络错误');
        if (obj.error && typeof obj.error == "function") {
          obj.error(error);
        }
      }
    });
  },
  toDateString: function (UTCString) {
    var d = new Date(UTCString);
    var add0 = function (num) {
      return num < 10 ? '0' + num : num;
    };
    return d.getFullYear() + '-' + add0((d.getMonth() + 1)) + '-' + add0(d.getDate()) + ' ' + add0(d.getHours()) + ':' + add0(d.getMinutes()) + ':' + add0(d.getSeconds());
  },
  repwd : function(){
    var html = '<div class="panel-body"><form class="form-horizontal" id="repwdForm"><div class="form-group"><label class="col-sm-3 control-label">旧密码 :</label><div class="col-sm-7 u-word"><input class="form-control" placeholder="旧密码" type="text" name="oldpassword"/></div></div><div class="form-group"><label class="col-sm-3 control-label">新密码 :</label><div class="col-sm-7 u-word"><input class="form-control" placeholder="新密码" type="text" name="password"/></div></div><div class="form-group"><label class="col-sm-3 control-label">确认新密码 :</label><div class="col-sm-7 u-word"><input class="form-control" placeholder="确认新密码" type="text" name="repassword"/></div></div></form></div>';
    bootbox.dialog({
      message: html,
      title: '添加',
      className: 'bootwrap',
      buttons: {
        ok: {
          label: "提交",
          className: "btn-success",
          callback: function () {
            CMS.ajax({
              url : '/sys/user/repwd',
              data : $('#repwdForm').serialize(),
              success : function(data) {
                $.success('更新成功');
              }
            });
          }
        },
        "cancel": {
          label: "取消",
          className: "btn-default",
          callback: function () {
          }
        }
      },
      complete: function(){
      }
    });
  }
};

//分页
function Pagination(option) {

  var _this = this;

  //默认配置
  this.defalut = {
    header: 2,
    tail: 2,
    main: 5,
    prev: true,
    next: true,
    paging: false,
    wrapper: 'body',
    currNo: 1,
    total: 1,
    callback: null
  };

  //初始化配置
  var initDefalut = function () {

    //修改默认配置
    if (option && typeof option === 'object' && !option.length) {
      for (var key in _this.defalut) {
        if (option.hasOwnProperty(key)) {
          _this.defalut[key] = option[key];
        }
      }
    } else {
      alert('参数错误！');
      return;
    }

    _this.defalut.header = _this.defalut.header > 3 ? 3 : _this.defalut.header;
    _this.defalut.tail = _this.defalut.tail > 3 ? 3 : _this.defalut.tail;
    _this.$wrapper = $(_this.defalut.wrapper);

  };

  function fill(begin, end) {
    var html = '';
    for (var i = begin; i <= end; i++) {
      if (_this.defalut.currNo == i) {
        html += '<li class="active"><a href="javascript:Pagination.go(' + i + ');">' + i + '</a></li>'
      } else {
        html += '<li><a href="javascript:Pagination.go(' + i + ');">' + i + '</a></li>'
      }

    }

    return html;
  }

  //页面渲染
  this.redner = function () {
    var html = '';
    html += '<ul class="pagination">';

    //最前面上一页
    if (_this.defalut.prev) {
      if (_this.defalut.currNo == 1) {
        html += '<li class="disabled">'
          + '<a href="#" aria-label="Previous">'
          + '<span aria-hidden="true">&laquo;</span>'
          + '</a>'
          + '</li>';
      } else {
        html += '<li>'
          + '<a href="javascript:Pagination.go(' + (_this.defalut.currNo - 1) + ');" aria-label="Previous">'
          + '<span aria-hidden="true">&laquo;</span>'
          + '</a>'
          + '</li>';
      }

    }
    ;

    //当页数较少时，全部显示
    if (_this.defalut.header + _this.defalut.tail >= _this.defalut.total) {

      html += fill(1, _this.defalut.total);

    } else {

      html += fill(1, _this.defalut.header);

      var tmpBeginNo = _this.defalut.currNo + 1 > _this.defalut.header ? _this.defalut.currNo + 1 : _this.defalut.header + 1;
      var tmpEndNo = _this.defalut.currNo > _this.defalut.total - _this.defalut.tail ? _this.defalut.total - _this.defalut.tail : _this.defalut.currNo;

      if (_this.defalut.currNo <= _this.defalut.main + 1) {
        html += fill(_this.defalut.header + 1, tmpEndNo);
      } else {
        html += '<li class="disabled"><a href="#">...</a></li>';
        html += fill(_this.defalut.currNo - parseInt(_this.defalut.main / 2), tmpEndNo);
      }

      if (_this.defalut.currNo >= _this.defalut.total - _this.defalut.main) {
        html += fill(tmpBeginNo, _this.defalut.total - _this.defalut.tail);
      } else {
        html += fill(tmpBeginNo, _this.defalut.currNo + parseInt(_this.defalut.main / 2));
        html += '<li class="disabled"><a href="#">...</a></li>';
      }

      html += fill(_this.defalut.total - _this.defalut.tail + 1, _this.defalut.total);

    }

    //最后面下一页
    if (_this.defalut.next) {
      if (_this.defalut.currNo == _this.defalut.total) {
        html += '<li class="disabled">'
          + '<a href="#" aria-label="Next">'
          + '<span aria-hidden="true">&raquo;</span>'
          + '</a>'
          + '</li>';
      } else {
        html += '<li>'
          + '<a href="javascript:Pagination.go(' + (_this.defalut.currNo + 1) + ');" aria-label="Next">'
          + '<span aria-hidden="true">&raquo;</span>'
          + '</a>'
          + '</li>';
      }

    }
    ;

    html += '</ul>';

    _this.$ele = $(html);
    _this.$wrapper.append(_this.$ele);

  };

  //分页跳转
  this.go = function (pageNo) {
    pageNo = +(pageNo || 1) || 1;
    this.defalut.currNo = pageNo;
    if (_this.$ele) {
      _this.$ele.remove();
    }


    if (_this.defalut.callback && (typeof _this.defalut.callback === 'function')) {
      _this.defalut.callback(pageNo);
    }
  };

  Pagination.go = function (pageNo) {
    _this.go(pageNo);
  };

  initDefalut();
}

//表格操作对象
function DataTable(options) {

  var _this = this;
  //分页对象
  var page = null;

  //缓存table对象
  var $table = _this.$table = $(options['id']);
  var pageSize = _this.pageSize = options['pageSize'] || 10;
  pageSize = +pageSize;
  //数据源
  var dataSrc = _this.dataSrc = options['list'];
  //总记录数
  _this.total = options['total'] || 0;
  //是否是真分页
  var paging = _this.paging = options['paging'];
  if (!paging) {
    _this.total = dataSrc.length;
  }
  //table的th
  var columns = _this.columns = options['columns'];
  //对指定列的操作
  var columnDefs = _this.columnDefs = options['columnDefs'];

  var initOption = function () {

    //创建表字符串
    var ths = ['<thead><tr>'];
    //创建表头
    for (var i = 0, len = columns.length; i < len; i++) {
      ths.push('<th>' + columns[i].title + '</th>');
    }
    ths.push('</thead></tr><tbody>');
    ths.push('</tbody>');
    $table.html(ths.join(''));
    $('.dataTables_info,.pagination-pos').remove();
    $table.parent().append('<div class="dataTables_info" id="datatable_info" role="status" aria-live="polite">共 ' + _this.total + ' 条数据</div>');
    $table.parent().append('<nav class="pagination-pos"></nav>');
  };

  //创建表格内容
  var loadContent = _this.loadContent = function (pageNo) {
    var ths = [];
    var begin = (pageNo - 1) * pageSize;
    var end = pageNo * pageSize;
    var dataSrc = _this.dataSrc;
    end = end > dataSrc.length ? dataSrc.length : end;
    //加载数据源
    for (var i = begin, len = end; i < len; i++) {
      ths.push('<tr>');
      for (var j = 0, len2 = columns.length; j < len2; j++) {
        var markCol = -1;
        if (columnDefs) {
          for (var k = 0, len3 = columnDefs.length; k < len3; k++) {
            if (columnDefs[k].targets == j) {
              if (typeof columnDefs[k].render === 'function') {
                var render = columnDefs[k].render(i, j, dataSrc[i]);
                if (columnDefs[k].width) {
                  ths.push('<td style="width:' + columnDefs[k].width + '">' + render + '</td>');
                } else {
                  ths.push('<td>' + render + '</td>');
                }
              } else {
                ths.push('<td> </td>');
              }
              markCol = k;
              break;
            }
          }
        }
        if (markCol == -1) {
          if (columns[j].data && dataSrc[i].hasOwnProperty(columns[j].data) && dataSrc[i][columns[j].data]) {
            ths.push('<td title="' + dataSrc[i][columns[j].data] + '">' + dataSrc[i][columns[j].data] + '</td>');
          } else {
            ths.push('<td> </td>');
          }
        }
      }
      ths.push('</tr>');
    }

    $table.find('tbody').html(ths.join(''));
    if (options.callback && typeof options.callback === 'function') {
      options.callback();
    }
  };

  var request = function (pageNo) {
    if (_this.paging) {
      if (options.ajax) {
        CMS.$body.prepend(CMS.$loading);
        $.ajax({
          url: CMS.url + options.ajax.url,
          data: options.ajax.data,
          beforeSend: function (xhr, obj) {
            if (obj.data) {
              obj.data += "&pageNo=" + pageNo + "&pageSize=" + _this.pageSize;
            } else {
              obj.data += "pageNo=" + pageNo + "&pageSize=" + _this.pageSize;
            }

          },
          type: "POST",
          timeout: "30000",
          dataType: "json",
          success: function (data) {
            try {
              if (data.status == "000") {
                _this.dataSrc = data.msg.list || [];
                _this.total = data.msg.count;
                page.defalut.total = data.msg.total;
                initOption();
                page.$wrapper = $('.pagination-pos');
                page.redner();
                _this.loadContent(1);
              } else if (data.status == "002") {
                window.location = 'login.html';
              } else {
                $.danger(data.msg.message);
              }
            } catch (e) {
              $.danger('数据解析出错');
            }
            CMS.$loading.remove();
          },
          error: function (error) {
            CMS.$loading.remove();
            $.danger('网络出错');
          }
        });

      }
    } else {
      initOption();
      page.$wrapper = $('.pagination-pos');
      page.redner();
      _this.loadContent(pageNo);
    }
  };

  var cnt = Math.ceil(_this.total / _this.pageSize);

  //初始化分页
  page = new Pagination({total: cnt, wrapper: '.pagination-pos', callback: request});
  page.go(1);
}
