/* eslint-disable no-console */
const http = require('http');
const IO = require('socket.io');

const registerNewBroadcastEvent = (socket, name) => {
  socket.on(name, (data) => {
    console.log(`broadcast emitting ${name} event`)
    socket.broadcast.emit(name, data);
  });
};

const registerNewEvent = (socket, name) => {
  console.log(`emitting ${name} event`)
  socket.on(name, (data) => {
    socket.emit(name, data);
  });
};

module.exports = () => {
  const app = http.createServer();
  const io = IO(app);
  app.listen(3000);

  io.on('connection', (socket) => {
    socket.on('register', (data, fn) => {
      console.log('register: ', data.name);
      if (data.broadcast) {
        console.log('registering broadcast event: ', data.name);
        registerNewBroadcastEvent(socket, data.name);
      } else {
        console.log('registering event: ', data.name);
        registerNewEvent(socket, data.name);
      }
      console.log('notifying result: ', data.name);
      fn(JSON.stringify());
      console.log('notified result: ', data.name);
    });
  });

  return {
    app,
    io
  };
};
