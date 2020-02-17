const gamepadController = require('./game-controller');
const socketEventServer = require('./socket-event-server');

module.exports = (window) => {
  socketEventServer();

  const gamepad = gamepadController(window);

  const display = window.document.querySelector('div[name="gamepadEvents"]');

  gamepad.on('gamepadButton', e => {
    display.innerText = JSON.stringify(e);
  });

  gamepad.on('gamepadAxis', e => {
    display.innerText = JSON.stringify(e);
  });
};
