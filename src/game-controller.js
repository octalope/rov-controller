const EventEmitter = require('events');

module.exports = (window) => {
  const haveEvents = 'ongamepadconnected' in window;
  const gamepadStates = {};
  const eventEmitter = new EventEmitter();

  const connecthandler = (e) => {
    addGamepad(e.gamepad);
  };

  const disconnecthandler = (e) => {
    removeGamepad(e.gamepad);
  };

  const addGamepad = (gamepad) => {
    gamepadStates[gamepad.index] = {
      gamepad
    };
    window.requestAnimationFrame(updateStatus);
  };

  const removeGamepad = (gamepad) => {
    delete gamepadStates[gamepad.index];
  };

  const getGamepadState = (gamepad) => {
    return {
      buttons: [
        ...gamepad.buttons.map(button => {
          let pressed;
          if (typeof button === 'object') {
            pressed = button.pressed ? 1.0 : 0.0;
          } else {
            pressed = button;
          }
          return pressed;
        })
      ],
      axes: [
        ...gamepad.axes.map(axis => {
          if (Math.abs(axis) < 0.0001) {
            return 0.0;
          }
          return axis;
        })
      ]
    };
  };

  const updateStatus = () => {
    if (!haveEvents) {
      scanGamepads();
    }

    for (let i in gamepadStates) {
      if (Object.prototype.hasOwnProperty.call(gamepadStates, i)) {
        const gamepadState = gamepadStates[i];
        const newState = getGamepadState(gamepadState.gamepad);
        fireStateChanges({i, oldState: gamepadState.state, newState});
        gamepadState.state = newState;
      }
    }

    window.requestAnimationFrame(updateStatus);
  };

  const fireStateChanges = ({i, oldState, newState}) => {
    if (oldState && newState) {
      const buttonChangeIndices = [];
      const axisChangeIndices = [];

      newState.buttons.forEach((button, index) => {
        if (oldState.buttons[index] !== button) {
          buttonChangeIndices.push(index);
        }
      });

      newState.axes.forEach((axis, index) => {
        if (oldState.axes[index] !== axis) {
          axisChangeIndices.push(index);
        }
      });

      buttonChangeIndices.forEach(index => {
        const data = {
          controller: i,
          button: index,
          state: newState.buttons[index]
        };
        eventEmitter.emit('gamepadButton', data);
      });

      axisChangeIndices.forEach(index => {
        const data = {
          controller: i,
          axis: index,
          state: newState.axes[index]
        };
        eventEmitter.emit('gamepadAxis', data);
      });
    }
  };

  const getGamepads = () => {
    if (window.navigator.getGamepads) {
      return window.navigator.getGamepads();
    } else if (window.navigator.webkitGetGamepads) {
      return window.navigator.webkitGetGamepads();
    } else {
      return [];
    }
  };

  const scanGamepads = () => {
    const gamepads = getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (gamepads[i].index in gamepadStates) {
          gamepadStates[gamepads[i].index].gamepad = gamepads[i];
        } else {
          addGamepad(gamepads[i]);
        }
      }
    }
  };

  const initialize = () => {
    window.addEventListener('gamepadconnected', connecthandler);
    window.addEventListener('gamepaddisconnected', disconnecthandler);

    if (!haveEvents) {
      setInterval(scanGamepads, 500);
    }
  };

  initialize();

  return {
    on: (name, callback) => (eventEmitter.on(name, callback))
  };
};
