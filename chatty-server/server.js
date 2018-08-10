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
let allUsers = [];
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
    username: "Anonymous" + Math.floor((Math.random() * 1000) + 1),
  }
  sendFirstConnection(client.userConnected, client);
  allUsers.push(client.userConnected);
  activeUsers.allUsers = allUsers;
  sendUsers(activeUsers);
  console.log(activeUsers);


  client.on('message', handleMessage);

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => {
    activeUsers.size = wss.clients.size;
    activeUsers.type = "users";
    console.log(client.userConnected.username);
    sendIDDisc(client.userConnected);
    sendUsers(activeUsers);
    console.log('Client disconnected');
  })
});

function sendIDDisc(user) {
  let disconnectedUser = {
    type: "incomingNotification",
    name: user.username,
    id: user.id,
  }
  activeUsers.allUsers = activeUsers.allUsers.filter(el => el.username !== user.username);
  console.log(activeUsers);
  disconnectedUser.content = `${user.username} left the chat. We don't need him anyway.`;
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
        if (client.userConnected.id == currentMsg.id) {
          updateUserList(client.userConnected.username, activeUsers.allUsers, currentMsg.username);
          client.userConnected.username = currentMsg.username;
        } else { console.log("Nothing changed!") }
      });
      currentMsg.id = uuidv4();
      sendUsers(activeUsers);
      broadcastMsg(JSON.stringify(currentMsg));
      break;
    default:
      // show an error in the console if the message type is unknown
      throw new Error("Unknown event type " + data.type);
  }
}

function updateUserList(name, array, newName) {
  objIndex = array.findIndex((obj => obj.username === name))
  array[objIndex].username = newName;
}

function handleConnection(client) {
  console.log(allMsgs);
  client.send(JSON.stringify(allMsgs));
}