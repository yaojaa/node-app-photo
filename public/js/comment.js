(function(){


    var pageNo = 1;
    var isLoadComment = true;
    var $comment = $('.m-comment-list');
    function loadComment(_pageNo) {
        pageNo = _pageNo || pageNo;
        $.get('/comment/page', {belongId: PAGECONFIG.photoId, pageNo: pageNo}, function (json) {

            if (json.errorno == 0) {
                var html = '';
                $('#comment-count').html(json.data.count);
                if (json.data.list.length < 10) {
                    isLoadComment = false;
                }
                for (var i = 0; i < json.data.list.length; i++) {
                    var item = json.data.list[i];
                    html += commentRender(item);
                }
            }
            $comment.append(html);
        });
    }
    function commentRender(item) {
        return '<div class="m-cmt-item">' +
            '<div class="icon">' +
            '<a href="/userspace/' + item.id + '"><img width="50" height="50"' +
            'src="' + item.userAvatar + '"></a>' +
            '</div>' +
            '<div class="cmt-cnt">' +
            '<div class="top"><a href="/userspace/' + item.id + '">' + item.nickname + '</a>' +
            '<div class="time">' + item.createAt + '</div>' +
            '</div>' +
            '<p>' + item.content +
            '</p>' +
            '</div>' +
            '</div>'
    }
    loadComment();
    $('.load-comment-more').click(function () {
        pageNo++;
        if (isLoadComment) {
            loadComment();
        } else {
            this.innerHTML = '没有数据了';
        }
    });

    $('#submit-comment').click(function () {
        var commentContent = $('#commentContent').val();
        $.post('/comment/add', {
            replyId: '', //回复人ID (对某个人回复对应的这个人ID,可省略)
            belongId: PAGECONFIG.photoId, //评论所属ID（图集的ID）
            content: commentContent //回复内容},function(data){
        }, function (data) {
            if (data.errorno == -2) {
                alert('请先登录');

            } else if (data.errorno == 0) {
                $('#commentContent').val('');
                $('.m-comment-list').html('');
                loadComment(1);
            }
        });
    });


})();