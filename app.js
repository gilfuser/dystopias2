

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
// const favicon = require('serve-favicon');
const path = require('path');

const app = express();
const root = path.join(__dirname, 'public');
console.log(root);

// --------------------------------------------------------------------
// SET UP PUSHER
// --------------------------------------------------------------------
// const Pusher = require('pusher');

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_APP_CLUSTER,
// });

// const pusherCallback = (err, req, res) => {
//   if (err) {
//     console.log('Pusher error:', err.message);
//     console.log(err.stack);
//   }
// };

// -------------------------------------------------
// SET UP OSC-js.js
// -------------------------------------------------

// const OSC = require('osc-js')

// const udpconfig = { udpServer: { port: 54321 }, udpClient: { port: 57120 } }
// const osc = new OSC({ plugin: new OSC.BridgePlugin(udpconfig) })

// osc.on('/hello', (message) => {
//   console.log(message.args)
// })

// osc.open() // start a WebSocket server on port 8080
// HOW TO USE THIS TO WEBRTC ?

// -------------------------------------------------
// SET UP EXPRESS
// -------------------------------------------------

// Parse application/json and application/x-www-form-urlencoded
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// Simple logger
app.use((req, res, next) => {
  console.log('%s %s', req.method, req.url);
  console.log(req.body);
  next();
});

// Error handler
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true,
}));

// Serve static files from directory
app.use(express.static(root));
*/
// Basic protection on _servers content
// app.get('/_servers', (req, res) => {
//   res.send(404);
// });

/* eslint-disable prefer-destructuring */

// Message proxy
/*
app.post('/message', (req, res) => {
  // TODO: Check for valid POST data
  // eslint disable
  const socketId = req.body.socketId;
  const channel = req.body.channel;
  const message = req.body.message;
  // eslint enable
  pusher.trigger(channel, 'message', message, socketId, pusherCallback);

  res.send(200);
});

// Open server on specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Application listening on Port:', port);
});
*/
// const express = require('express')
// const app = express()
app.use(express.static(root));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(5000, () => console.log('Example app listening on port 5000!'));
