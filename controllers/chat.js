// var io = require('socket.io').listen(server);
// console.log(io);


// io.on('connection', function(socket){


//   socket.on('connection',function(){

//       io.emit('connection', '有人进来了');

//   })


//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });

// });


// //chat

var users=require('../user_data').users;


exports.chat = function(req, res) {

    res.render('chat', {
            title: '即时投票',
            users: users,

    })
};
