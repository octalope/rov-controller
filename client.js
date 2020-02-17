const SocketEventClient = require('./src/socket-event-client');

const client = SocketEventClient();
client.connect('http://127.0.0.1:3000');

client.subscribeEvent('gamepadAxis', (data) => {
  console.log(`gamepadAxis: ${JSON.stringify(data)}`);
});

client.subscribeEvent('gamepadButton', (data) => {
  console.log(`gamepadButton: ${JSON.stringify(data)}`);
});

