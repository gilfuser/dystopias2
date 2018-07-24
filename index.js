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

const express = require('express')

const app = express();

app.get('/', (req, res) => {
    re.send("Cibele, meu amor!")
})

app.listen(5000, () => {
    console.log('Server started on port 5000.')
})