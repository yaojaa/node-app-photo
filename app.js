var config = require('./config');

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var cors = require('cors');

var handlebars = require('express-handlebars')
  .create({
    defaultLayout: 'main',
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      }
    }
  });
// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
//app.use(function(req,res,next){
//  if(!res.locals.partials) res.locals.partials = {};
//});

// //开启cookie
app.use(cookieParser(config.session_secret));
app.use(session({
  secret: config.session_secret,
  name: 'defautsession22',

  cookie: {
    maxAge: 1000 * 60 * 30 *5
  }, //session设置30分钟
  resave: false,
  saveUninitialized: true,
}))





// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


//通用的中间件


// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


//处理session的中间件
app.use(function (req, res, next) {
  req.user = res.locals.user = req.session.user;
  app.locals.default_avatar=config.avatar
  next();
});

app.locals.qn_access=config.qn_access


//验证是否自动登录 这里会执行多次
// app.use(function (req, res, next) {


//   if (!req.session.user) {
//     var login = require('./controllers/sign.js');
//     login.checkIsLogin(req)
//   } else {
//     next()
//   }

// });


//static中间件
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


//路由
var router = require('./routers.js');
var apiRouterV1 = require('./api_router_v1');

app.use('/api/v1', cors(), apiRouterV1);
app.use('/', router);

// app.use(function(req, res, next) {

//   res.locals.showTests=app.get('env')!=='production' && req.query.test==='1'

//   next();
// });




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = app.listen(config.port, function () {
  var host = 'localhost';
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
