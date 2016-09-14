var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// send current users of provided socket
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];

        if (info.room == userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users are ' + users.join(', ')
    });
}

// send private message to user
function sendPrivateMessage(socket, message) {
    var info = clientInfo[socket.id];
    var message = message.text.replace('@private ', '');
    var userTo = message.split(' ')[0].slice(1);

    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];

        if (userTo == userInfo.name) {
            io.sockets.in(socketId).emit('message', {
                name: 'Private message from ' + info.name,
                text: message
            });
        } return 'undefined';
    });
}

io.on('connection', function (socket) {
    console.log('user connected via socket.io');

    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];
        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left.'
            });
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined'
        })
    });

    socket.on('message', function (message) {
        console.log('Message received. ', message.text);

        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        } else if (message.text.includes('@private')) {
            sendPrivateMessage(socket, message);
        } else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message);
        }

    })

    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat application'
    });
});

http.listen(PORT, function () {
    console.log('Server started on port ', PORT);
})