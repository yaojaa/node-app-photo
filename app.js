var config = require('./config');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

//自定义模块
var f=require('./public/lib/fortune.js')

// var routes = require('./routes/index');
// var users = require('./routes/users');
// var about = require('./routes/about');


var app = express();

var handlebars=require('express3-handlebars')
                .create({defaultLayout:'main'});

// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


//通用的中间件


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')(config.session_secret));
app.use(session({ secret: config.session_secret, cookie: { maxAge: 60000 }}))

//处理session的中间件
app.use(function(req, res, next) {
  req.user=res.locals.user=req.session.uid
  next();
});

//static中间件
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


//路由
var router=require('./routers.js');
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
