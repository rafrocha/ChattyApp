// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

let currentMsg = '';

let allMsgs = [];
let activeUsers = {};
const userColors = ["lime", "teal", "orange", "brown", "blueviolet", "red", "navy"];

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (client) => {
  client.id = uuidv4();
  console.log(client.id);
  handleConnection(client);
  activeUsers.size = wss.clients.size;
  activeUsers.type = "users";
  client.userConnected = {
    color: userColors[Math.floor(Math.random() * userColors.length)],
    type: "initialConnection",
    id: client.id,
    username: "",
  }
  sendFirstConnection(client.userConnected, client);
  sendUsers(activeUsers);


  client.on('message', handleMessage);

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => {
    activeUsers.size = wss.clients.size;
    activeUsers.type = "users";
    console.log(client.userConnected.username);
    sendUsers(activeUsers);
    sendIDDisc(client.userConnected);
    console.log('Client disconnected');
  })
});

function sendIDDisc(user) {
  let disconnectedUser = {
    type: "incomingNotification",
    name: user.username,
    id: user.id,
  }
  if (user.username === "") {
    disconnectedUser.content = `Anonymous person left the chat. We don't need him anyway.`;
  } else {
    disconnectedUser.content = `${user.username} left the chat. We don't need him anyway.`;
  }
  broadcastMsg(JSON.stringify(disconnectedUser));
}

function sendUsers(users) {
  broadcastMsg(JSON.stringify(users));
}

function sendFirstConnection(user, client) {
  client.send(JSON.stringify(user));
}

function broadcastMsg(data) {
  wss.clients.forEach(function(client) {
    client.send(data);
  })
}

function handleMessage(message) {
  currentMsg = JSON.parse(message);
  console.log(currentMsg);
  allMsgs.push(currentMsg);
  switch (currentMsg.type) {
    case "postMessage":
      currentMsg.id = uuidv4();
      currentMsg.type = "incomingMessage";
      broadcastMsg(JSON.stringify(currentMsg));
      console.log("type:", currentMsg.type, "User:", currentMsg.username, "Content:", currentMsg.content, currentMsg.id);
      break;
    case "postNotification":
      currentMsg.type = "incomingNotification";
      wss.clients.forEach(function(client) {
        console.log(client.userConnected.id);
        console.log(currentMsg.id);
        if (client.userConnected.id == currentMsg.id) {
          client.userConnected.username = currentMsg.username;
          console.log(client.userConnected.username);
        } else { console.log("Nothing changed!") }
      });
      currentMsg.id = uuidv4();
      broadcastMsg(JSON.stringify(currentMsg));
      break;
    default:
      // show an error in the console if the message type is unknown
      throw new Error("Unknown event type " + data.type);
  }
}

function handleConnection(client) {
  console.log(allMsgs);
  client.send(JSON.stringify(allMsgs));
}