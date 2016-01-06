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
console.log(__dirname);
app.set('views', __dirname + '/views');

// //开启cookie
app.use(cookieParser(config.session_secret));
app.use(session({
  secret: config.session_secret,
  name: 'defautsession',

  cookie: {
    maxAge: 1000 * 60 * 30
  }, //session设置30分钟
  resave: false,
  saveUninitialized: true,
}))


/**
 * cookie 中间件
 * 先判断是否有cookie，有的话直接登录
 */
// app.use(function(req, res, next) {

// })


//消息提示组件
// app.use(flash());

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
  next();
});


app.use(function (req, res, next) {


  if (!req.session.user) {

    console.log('no session');
    var login = require('./controllers/sign.js');
    login.checkIsLogin(req, res, next)
  } else {
    next()
  }

});


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


app.get('/vacations', function (req, res) {
  vacation.find({
    available: true
  }, function (err, vacations) {

    var context = {
      vacations: vacations.map(function (vacation) {
        return {
          sku: vacation.sku,
          name: vacation.name,
          descripton: vacation.descripton,
          price: vacation.getDisplayPrice(),
          inSeason: vacation.inSeason,
        }
      })
    }

  })

  res.render('vacations', context)

})

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


//socket 相关

var users = require('./user_data').users;


var io = require('socket.io').listen(server);

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;


io.on('connection', function (socket) {
  var addedUser = false;

  io.emit('connect', usernames);

  socket.on('disconnect', function () {
    console.log('user disconnected');

    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;
    }


    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: numUsers
    });


  });


  socket.on('message', function (msg) {
    io.emit('messagecome', msg);
  });


  socket.on('vote', function (name) {
    users.forEach(function (value, index) {
      if (value.name == name) {
        value.score++;

        io.emit('upmessagecome', {
          name: value.name,
          score: value.score
        });
        return false

      }
    })
  });


  socket.on('down', function (name) {
    users.forEach(function (value, index) {
      if (value.name == name) {
        value.score--;
        io.emit('upmessagecome', {
          name: value.name,
          score: value.score
        });
        return false

      }
    })
  });


  socket.on('add user', function (username) {
    console.log(username);
    addedUser = true;
    // we store the username in the socket session for this client
    socket.username = username;
    usernames[username] = username;
    ++numUsers;
    socket.broadcast.emit('login', {
      numUsers: numUsers,
      username: socket.username
    });

    // echo globally (all clients) that a person has connected
    io.emit('user joined', {
      usernames: usernames,
      numUsers: numUsers,
      voteUsers: users
    });

  });


});

//socket end


module.exports = app;
