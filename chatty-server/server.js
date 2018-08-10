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

//sets primary arrays for all the messages, all users and the object containing all users and their info.
let allMsgs = [];
let allUsers = [];
let activeUsers = {};
const userColors = ["lime", "teal", "orange", "brown", "blueviolet", "red", "navy"];

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (client) => {
  client.id = uuidv4();
  console.log("User connected");
  handleConnection(client);
  //Creates newUser object for the person connected. Also sets the size and type of active users object.
  let newUser = "Anonymous" + Math.floor((Math.random() * 1000) + 1);
  activeUsers.size = wss.clients.size;
  activeUsers.type = "users";
  client.userConnected = {
    color: userColors[Math.floor(Math.random() * userColors.length)],
    type: "initialConnection",
    id: client.id,
    content: `${newUser} has connected. Welcome to Chatty!`,
    username: newUser,
  }

  sendFirstConnection(client.userConnected, client);
  //Adds the current user to the array of users.
  allUsers.push(client.userConnected);
  activeUsers.allUsers = allUsers;
  sendUsers(activeUsers);
  broadcastMsgFirst(client.userConnected);

  //When server receives a message:
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

//function to send the notification of user disconected and also filter OUT the user disconected from the array of current users.
function sendIDDisc(user) {
  let disconnectedUser = {
    type: "incomingNotification",
    name: user.username,
    id: uuidv4(),
  }
  activeUsers.allUsers = activeUsers.allUsers.filter(el => el.username !== user.username);
  allUsers = activeUsers.allUsers;
  disconnectedUser.content = `${user.username} left the chat. We don't need him anyway.`;
  disconnectedUser.newUsers = activeUsers.allUsers;
  broadcastMsg(disconnectedUser);
}

//Sends users to all clients.
function sendUsers(users) {
  broadcastMsg(users);
}

//sends the new user info to react client that logged in. Setting all the values to that new user states.
function sendFirstConnection(user, client) {
  client.send(JSON.stringify(user));
}

//Sends to all clients a notification of the user that connected.
function broadcastMsgFirst(data) {
  let msg = data;
  msg.type = "WelcomeMSG";
  let sentMsg = JSON.stringify(msg);
  wss.clients.forEach(function(client) {
    client.send(sentMsg);
  })
}

//broadcasts message to all clients.
function broadcastMsg(data) {
  wss.clients.forEach(function(client) {
    client.send(JSON.stringify(data));
  })
}

//Handles incoming messages depending on their type.
function handleMessage(message) {
  currentMsg = JSON.parse(message);
  allMsgs.push(currentMsg);
  switch (currentMsg.type) {
    //post messages are the messages posted on the chat.
    case "postMessage":
      currentMsg.id = uuidv4();
      currentMsg.type = "incomingMessage";
      broadcastMsg(currentMsg);
      break;
      //post notifications can be users connecting, disconnecting or changing their name. Changes the name on current client connected.
    case "postNotification":
      currentMsg.type = "incomingNotification";
      wss.clients.forEach(function(client) {
        if (client.userConnected.id == currentMsg.id) {
          updateUserList(client.userConnected.username, activeUsers.allUsers, currentMsg.username);
          client.userConnected.username = currentMsg.username;
        } else { console.log("Nothing changed!") }
      });
      currentMsg.id = uuidv4();
      //sends the new users to update online users list with new names or removing old names.
      sendUsers(activeUsers);
      broadcastMsg(currentMsg);
      break;
    default:
      // show an error in the console if the message type is unknown
      throw new Error("Unknown event type " + data.type);
  }
}

//helper function to update username on the list when name is changed by user.
function updateUserList(name, array, newName) {
  objIndex = array.findIndex((obj => obj.username === name))
  array[objIndex].username = newName;
}

//initial function to send the new connected user all the previous existing messages.
function handleConnection(client) {
  client.send(JSON.stringify(allMsgs));
}