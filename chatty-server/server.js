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

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (client) => {
  handleConnection(client);


  client.on('message', handleMessage);

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => console.log('Client disconnected'));
});

function broadcastMsg(data){
  wss.clients.forEach(function(client) {
    client.send(data);
  })
}

function handleMessage(message){
  currentMsg = JSON.parse(message);
  currentMsg.id = uuidv4();
  allMsgs.push(currentMsg);
  switch(currentMsg.type) {
      case "postMessage":
        currentMsg.type = "incomingMessage";
        broadcastMsg(JSON.stringify(currentMsg));
        console.log("type:",currentMsg.type, "User:",currentMsg.username, "Content:",currentMsg.content, currentMsg.id);
        break;
      case "postNotification":
        currentMsg.type = "incomingNotification";
        broadcastMsg(JSON.stringify(currentMsg));
        console.log("type:",currentMsg.type, "Content:",currentMsg.content);
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
    }
}

function handleConnection(client){
  client.send(JSON.stringify(allMsgs));
}