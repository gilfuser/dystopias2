var config;
try {
  config = require("./config");
} catch(e) {
  console.log("Failed to find local config, falling back to environment variables");
  config = {
    app_id: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
  }
}

// -------------------------------------------------------------
// SET UP PUSHER
// -------------------------------------------------------------
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: config.app_id,
  key: config.key,
  secret: config.secret,
  cluster: config.cluster
});

// ------------------------------------------------------
// SET UP EXPRESS
// ------------------------------------------------------


const express = require('express')
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const app = express()
const root = __dirname + "/public";

// Parse application/json and application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Simple logger
app.use( (req, res, next) => {
  console.log("%s %s", req.method, req.url);
  console.log(req.body);
  next();
});

// Error handler
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}))

// Serve static files from directory
app.use(express.static(root));

// Message proxy
app.post("/message", (req, res) => {
  let socketId = req.body.socketId;
  let channel = req.body.channel
  let message = req.body.message

  pusher.trigger(channel, "message", message, socketId)

  res.send(200)
})

// Open server on specified port
const port = process.env.PORT || 5000;
app.listen( port, () => console.log('Server started on port:', port))