import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx'
import NavBar from './navbar.jsx'


class App extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws://localhost:3001");
    this.state = {
      loading: true,
      currentUser: { name: "Anonymous"+Math.floor((Math.random() * 100) + 1), color: "black", id: ""},
      messages: [],
      onlineUsers: 0
    };
    this.addMessage = this.addMessage.bind(this);
    this.IncomingMessage = this.IncomingMessage.bind(this);
    this.serverConnected = this.serverConnected.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  addMessage(e) {
    e.preventDefault();
    const content = e.target.elements.chatMessage.value;
    const username = this.state.currentUser.name;
    console.log(this.state.currentUser);
    console.log(username);
    const color = this.state.currentUser.color;
    const type = "postMessage";
    if (!content) {
      return;
    };
    const newMessage = {
      content,
      type,
      username,
      color
    };
    this.socket.send(JSON.stringify(newMessage));
    e.target.elements.chatMessage.value = "";
  };

  changeUser(e) {
    e.preventDefault();
    const type = "postNotification";
    const previousUser = this.state.currentUser.name;
    let newUser = e.target.elements.chatName.value;
    const id = this.state.currentUser.id;
    const content = `${previousUser} has changed their name to ${newUser}.`;
    if (!newUser) {
      this.setState({ currentUser: { name: "Anonymous" } });
    } else {
      const newNotification = {
        content,
        type,
        username: newUser,
        id
      };
      this.setState({ currentUser: { name: newUser, color: this.state.currentUser.color, id: this.state.currentUser.id } });
      this.socket.send(JSON.stringify(newNotification));
      }
      console.log(this.state.currentUser.name);
    }


    IncomingMessage(incMessage) {
      let message = JSON.parse(incMessage.data);
      //Checks if the message coming in is an array (when user connects for the first time,
      // the pre-existing messages from the chat are loaded as arrays.
      //If it's not an array (regular post messages or other notifications, it will follow the switch checking.))
      if(Array.isArray(message)){
        const messages = this.state.messages.concat(message);
        this.setState({ messages });
      } else {
      switch (message.type) {
        case "initialConnection":
        console.log(message);
          this.setState({ currentUser: { name: this.state.currentUser.name, color: message.color, id: message.id } });
          break;
        case "incomingMessage":
          const messages = this.state.messages.concat(message);
          this.setState({ messages });
          break;
        case "incomingNotification":
          const notifications = this.state.messages.concat(message);
          this.setState({ messages: notifications });
          break;
        case "users":
          const users = message.size;
          this.setState({ onlineUsers: users });
          console.log(this.state.onlineUsers);
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
      }
    }
    };

    serverConnected() {
      console.log("Connected to server!");
    };

    componentDidMount() {
      this.socket.addEventListener('open', this.serverConnected);
      this.socket.addEventListener('message', this.IncomingMessage);
    };

    render() {
      const usersOnline = < NavBar onlineUsers={this.state.onlineUsers}/>
      const messageList = < MessageList message={ this.state.messages } user={this.state.currentUser.name}/>
      return (
      <div>
      {usersOnline}
        { messageList }
        <ChatBar onSubmit={ this.addMessage } changeUser={ this.changeUser } currentUser={ this.state.currentUser }/>
        </div>
      );
    }
  }
  export default App;