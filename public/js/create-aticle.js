(function () {

		var um = UM.getEditor('editor', {
            imageUrl:GLOBAL.uploadURL,
            imagePath:GLOBAL.Domain,
            lang:/^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
            langPath:UMEDITOR_CONFIG.UMEDITOR_HOME_URL + "lang/",
            autoFloatEnabled :false
            });


/*如果是编辑页面写入编辑器html*/
if(GLOBAL.isEditPage){
um.ready(function() {
    um.setContent(GLOBAL.content);
});

}






/*限制字数*/

$('#des').limitTextarea({  
    maxNumber:150,     //最大字数  
    position:'bottom', //提示文字的位置，top：文本框上方，bottom：文本框下方  
    onOk:function(){  
      $('#des').css('background-color','white');      
    },                 //输入后，字数未超出时调用的函数  
    onOver:function(){  
      $('#des').css('background-color','lightpink');      
    }                  //输入后，字数超出时调用的函数，这里把文本区域的背景变为粉红色     
  });      



var postUrl=(function(){

    if(GLOBAL.isEditPage){
    return '/api/v1/updateAticle'
    }else{
    return  '/api/v1/createAticle'
    }


  })()

var postAticle=function(){



    var postdata={
      title:$('#title').val(),
      des:$('#des').val(),
      content:um.getContent(),
      _id:GLOBAL.atilce_id
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

    $.post(postUrl,postdata,function(res) {

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
      else if(res.errorno==0){
       var aticleId=res.data._id;
                   swal({
                    title: res.msg,
                    type: "success",
                    showCancelButton: false,
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