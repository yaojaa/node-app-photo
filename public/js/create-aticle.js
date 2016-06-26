(function () {

		var um = UM.getEditor('editor', {
            imageUrl:GLOBAL.uploadURL,
            imagePath:GLOBAL.Domain,
            lang:/^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
            langPath:UMEDITOR_CONFIG.UMEDITOR_HOME_URL + "lang/",
            focus: true
        });






var postAticle=function(){

    var postdata={
      title:$('#title').val(),
      content:um.getContent(),
    }

    if(postdata.title=='' ){

         swal({
                title: '标题不能为空',
                type: "warning",
                showCancelButton: false
              })
      return 
    }

     if(postdata.content.length<10){

         swal({
                title: '内容字数不足',
                type: "warning",
                showCancelButton: false
              })
      return 
    }

    $.post('/api/v1/createAticle',postdata,function(res) {

      if(res.errorno==-1){
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

      }
      else if(res.error==0){

       var aticleId=res.data._id;
                   swal({
                    title: '发布成功',
                    type: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "立即查看",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function() {
                    location.href = "/a/"+aticleId
                });



      }else{
        alert(res.msg)
      }
    })

}


    $('#Jsubmit').on('click',postAticle)
	// body...
})()