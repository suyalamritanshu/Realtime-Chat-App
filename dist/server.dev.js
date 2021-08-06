"use strict";

var path = require('path');

var http = require('http');

var express = require('express');

var socketio = require('socket.io');

var formatMessage = require('./utils/messages');

var _require = require('./utils/users'),
    userJoin = _require.userJoin,
    getCurrentUser = _require.getCurrentUser,
    userLeave = _require.userLeave,
    getRoomUsers = _require.getRoomUsers;

var app = express();
var server = http.createServer(app);
var io = socketio(server); // Set static folder

app.use(express["static"](path.join(__dirname, 'public')));
var botName = 'Realtime Bot'; // Run when client connects

io.on('connection', function (socket) {
  socket.on('joinRoom', function (_ref) {
    var username = _ref.username,
        room = _ref.room;
    var user = userJoin(socket.id, username, room);
    socket.join(user.room); // Welcome current user

    socket.emit('message', formatMessage(botName, 'Welcome to Realtime chat app!')); // Broadcast when a user connects

    socket.broadcast.to(user.room).emit('message', formatMessage(botName, "".concat(user.username, " has joined the chat"))); // Send users and room info

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  }); // Listen for chatMessage

  socket.on('chatMessage', function (msg) {
    var user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  }); // Runs when client disconnects

  socket.on('disconnect', function () {
    var user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, "".concat(user.username, " has left the chat"))); // Send users and room info

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});
var PORT = process.env.PORT || 4000;
server.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
