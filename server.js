var express=require('express');
var path=require('path');
var app=express();
var fs=require('fs');
var indexHtml=fs.readFileSync(path.join(__dirname,'/dist/index.html'));
app.use(express.static(path.join(__dirname, './dist')));

app.use(function (req,res,next) {
  if(req.url.indexOf('/static')===-1){
    res.setHeader('content-type','html');
    res.send(indexHtml);
  }else{
    next();
  }

});

app.listen(8888,function () {
  console.log('server start at port:8888')
});