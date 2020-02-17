const gamepadController = require('./game-controller');
const SocketEventServer = require('./socket-event-server');
const SocketEventClient = require('./socket-event-client');

module.exports = async (window) => {
  SocketEventServer();

  const gamepad = gamepadController(window);

  const client = SocketEventClient();
  client.connect('http://127.0.0.1:3000');

  await client.registerEvent('gamepadAxis', {broadcast: true});
  await client.registerEvent('gamepadButton', {broadcast: true});

  const display = window.document.querySelector('div[name="gamepadEvents"]');

  gamepad.on('gamepadAxis', e => {
    display.innerText = JSON.stringify(e);
    client.emitEvent('gamepadAxis', e);
  });

  gamepad.on('gamepadButton', e => {
    display.innerText = JSON.stringify(e);
    client.emitEvent('gamepadButton', e);
  });

};
