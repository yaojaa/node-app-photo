var config = require('./config');

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var cors = require('cors');

var handlebars = require('express3-handlebars')
  .create({
    defaultLayout: 'main',
    helpers: {
      section: function (name, options) {
        if (!this._sections)this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      }
    }
  });

// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// //开启cookie
app.use(cookieParser(config.session_secret));
app.use(session(
  { secret: config.session_secret, 
    name:'defautsession',

    cookie: { maxAge: 1000 * 60 * 30 },//session设置30分钟
     resave: false,
    saveUninitialized: true,
  }
    ))


/**
* cookie 中间件
* 先判断是否有cookie，有的话直接登录
*/
app.use(function (req, res, next) {
    if (req.session.user) {
        return next();//若有session，直接跳过此中间件
    } else {
        var cookie = req.signedCookies[config.auth_cookie_name];//读cookie，通过配置文件中标识符读cookie
            if (!cookie) {
                return next();//若没有此站点的cookie，直接跳过此中间件
            }

  //?????拿到cookie后应该到服务器端验证！！这里暂时未做验证！！！
        var auth = cookie.split('$$$$');
        var username = auth[0], passwd = auth[1];//解密后拿到username与password
            var data = {
                username:username,
                password:passwd,
            }

          req.session.user = data;//存在此用户，开启session，存储user
          return next();//进行下一步
        
       }

        })



//消息提示组件
// app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


//通用的中间件


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





//处理session的中间件
app.use(function(req, res, next) {
  req.user=res.locals.user=req.session.user;
  next();
});




//static中间件
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


//路由
var router=require('./routers.js');
var apiRouterV1 = require('./api_router_v1');

app.use('/api/v1', cors(), apiRouterV1);
app.use('/', router);

// app.use(function(req, res, next) {

//   res.locals.showTests=app.get('env')!=='production' && req.query.test==='1'

//   next();
// });




app.get('/vacations',function(req,res){
  vacation.find({available:true},function(err,vacations){

    var context={
        vacations:vacations.map(function(vacation){
          return {
            sku:vacation.sku,
            name:vacation.name,
            descripton:vacation.descripton,
            price:vacation.getDisplayPrice(),
            inSeason:vacation.inSeason,
          }
        })
    }

  })

  res.render('vacations',context)

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server=app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
