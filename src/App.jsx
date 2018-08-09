import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx'


class App extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws://localhost:3001");
    this.state = {
      loading: true,
      currentUser: { name: "Raf" },
      messages: []
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
    const type = "postMessage";
    if (!content) {
      return;
    };
    const newMessage = {
      content,
      type,
      username
    };
    this.socket.send(JSON.stringify(newMessage));
    e.target.elements.chatMessage.value = "";
  };

  changeUser(e) {
    e.preventDefault();
    const type = "postNotification";
    const previousUser = this.state.currentUser.name;
    let newUser = e.target.elements.chatName.value;
    const content = `${previousUser} has changed their name to ${newUser}`;
    if (!newUser) {
      this.setState({ currentUser: { name: "Anonymous" } });
    } else {
      const newNotification = {
        content,
        type
      };
      this.setState({ currentUser: { name: newUser } });
      this.socket.send(JSON.stringify(newNotification));
      }
      console.log(this.state.currentUser.name);
    }

    IncomingMessage(incMessage) {
      let message = JSON.parse(incMessage.data);
      switch (message.type) {
        case "incomingMessage":
          const messages = this.state.messages.concat(message);
          this.setState({ messages });
          break;
        case "incomingNotification":
          const notifications = this.state.messages.concat(message);
          this.setState({ messages: notifications });
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
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
      const messageList = < MessageList message={ this.state.messages }/>
      return (
      <div>
        <h1> 🤗 </h1> { messageList }
        <ChatBar onSubmit={ this.addMessage } changeUser={ this.changeUser } currentUser={ this.state.currentUser }/>
        </div>
      );
    }
  }
  export default App;