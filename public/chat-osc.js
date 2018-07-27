// Initialise DataChannel.js
const datachannel = new DataChannel();

// Set the userid based on what has been defined by DataChannel
// https://github.com/muaz-khan/WebRTC-Experiment/tree/master/DataChannel#use-custom-user-ids
datachannel.userid = window.userid;

// Open a connection to Pusher
const pusher = new Pusher("72bd0eccc241c799a018", { cluster: "us2" });

// Storage of Pusher connection socket ID
var socketId;

Pusher.log = (message) => {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};

// Monitor Pusher connection state
pusher.connection.bind("state_change", (states) => {
  switch (states.current) {
    case "connected":
      socketId = pusher.connection.socket_id;
      break;
    case "disconnected":
    case "failed":
    case "unavailable":
      break;
  }
});

// Set custom Pusher signalling channel
// https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md
datachannel.openSignalingChannel = (config) => {
  let channel = config.channel || this.channel || "default-channel";
  let xhrErrorCount = 0;

  let socket = {
    send: function(message) {
      $.ajax({
        type: "POST",
        url: "/message", // Node.js & Ruby (Sinatra)
        // url: "_servers/php/message.php", // PHP
        data: {
          socketId: socketId,
          channel: channel,
          message: message
        },
        timeout: 1000,
        success: (data) => {
          xhrErrorCount = 0;
        },
        error: function(xhr, type) {
          // Increase XHR error count
          xhrErrorCount++;

          // Stop sending signaller messages if it's down
          if (xhrErrorCount > 5) {
            console.log("Disabling signaller due to connection failure");
            datachannel.transmitRoomOnce = true;
          }
        }
      });
    },
    channel: channel
  };

  // Subscribe to Pusher signalling channel
  let pusherChannel = pusher.subscribe(channel);

  // Call callback on successful connection to Pusher signalling channel
  pusherChannel.bind("pusher:subscription_succeeded", function() {
    if (config.callback) config.callback(socket);
  });

  // Proxy Pusher signaller messages to DataChannel
  pusherChannel.bind("message", function(message) {
    config.onmessage(message);
  });

  return socket;
};

const onCreateChannel = function() {
  let channelName = cleanChannelName(channelInput.value);

  if (!channelName) {
    console.log("No channel name given");
    return;
  }

  disableConnectInput();

  datachannel.open(channelName);
};

const onJoinChannel = function() {
  let channelName = cleanChannelName(channelInput.value);

  if (!channelName) {
    console.log("No channel name given");
    return;
  }

  disableConnectInput();

  // Search for existing data channels
  datachannel.connect(channelName);
};

const cleanChannelName = (channel) => {
  return channel.replace(/(\W)+/g, "-").toLowerCase();
};

const onSendMessage = () => {
  let message = messageInput.value;
  if (!message) {
    console.log("No message given");
    return;
  }
  datachannel.send(message);
  addMessage(message, window.userid, true);
  messageInput.value = "";
};

const onMessageKeyDown = (event) => {
  if (event.keyCode == 13){
    onSendMessage();
  }
};

const addMessage = (message, userId, self) => {
  let messages = messageList.getElementsByClassName("list-group-item");

  // Check for any messages that need to be removed
  let messageCount = messages.length;
  for (let i = 0; i < messageCount; i++) {
    let msg = messages[i];

    if (msg.dataset.remove === "true") {
      messageList.removeChild(msg);
    }
  };

  let newMessage = document.createElement("li");
  newMessage.classList.add("list-group-item");

  if (self) {
    newMessage.classList.add("self");
    newMessage.innerHTML = "<span class='badge'>You</span><p>" + message + "</p>";
  } else {
    newMessage.innerHTML = "<span class='badge'>" + userId + "</span><p>" + message + "</p>"
  }

  messageList.appendChild(newMessage);
};

const disableConnectInput = function() {
  channelInput.disabled = true;
  createChannelBtn.disabled = true;
  joinChannelBtn.disabled = true;
};

let sendOsc = false

const sendOSC = () => {
  if(sendOsc == false) {
    console.log("barabin")
    sendOsc = true
    // Checkbox is checked..
} else if(sendOsc == true) {
  oscMsg()
  console.log("barabang")
  sendOsc = false
}
  // oscMsg()
}

datachannel.onmessage = (message, userId) =>
  addMessage(message, userId);
  const oscMsg = () => setInterval( () => {
    if(sendOsc == true){
      let msg = {
        address: "/hello/from/oscjs",
        args: [
          {
            type: "f",
            value: Math.random()
          },
          {
            type: "f",
            value: Math.random()
          }
        ]
      };
      msg = [msg.address, msg.args[0].value, msg.args[1].value]
      console.log("Sending message", msg /*, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort*/);
      datachannel.send(msg);
    }
  }, 1000 
);

var osc = new OSC();
osc.open(); // connect by default to ws://localhost:8080

document.getElementById('send-osc').addEventListener('click', function() {
    let message = new OSC.Message('/test/random', Math.random());
    osc.send(message);
});

document.getElementById('test-osc').addEventListener('click', function() {
    console.log(window.test.value)
});

// Demo DOM elements
const channelInput = document.querySelector(".demo-chat-channel-input")
const createChannelBtn = document.querySelector(".demo-chat-create")
const joinChannelBtn = document.querySelector(".demo-chat-join")
const messageInput = document.querySelector(".demo-chat-message-input")
const sendBtn = document.querySelector(".demo-chat-send")
const messageList = document.querySelector(".demo-chat-messages")
const createOSCbtn = document.querySelector('.send-osc')

// Set up DOM listeners
createChannelBtn.addEventListener("click", onCreateChannel);
joinChannelBtn.addEventListener("click", onJoinChannel);
sendBtn.addEventListener("click", onSendMessage);
messageInput.addEventListener("keydown", onMessageKeyDown);
createOSCbtn.addEventListener("click", sendOSC );

// hook up the DataChannel.js events for successfully connecting via WebRTC, and for receiving messages over WebRTC:
// Set up DataChannel handlers
datachannel.onopen = (userId) => {
  document.querySelector(".demo-connect").classList.add("inactive");
  document.querySelector(".demo-chat").classList.remove("inactive");
  messageInput.focus();
}