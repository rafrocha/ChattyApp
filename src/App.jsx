import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentUser: { name: "Raf" },
      messages: [{
          type: "incomingMessage",
          id: "1234",
          content: "I won't be impressed with technology until I can download food.",
          username: "Anonymous1"
        },
        {
          type: "incomingMessage",
          id: "3123123",
          content: "I wouldn't want to download Kraft Dinner. I'd be scared of cheese packet loss.",
          username: "Anonymous2"
        },
        {
          type: "incomingMessage",
          id: "31223",
          content: "...",
          username: "nomnom"
        },
        {
          type: "incomingMessage",
          id: "55656",
          content: "I'd love to download a fried egg, but I'm afraid encryption would scramble it",
          username: "Anonymous2"
        },
        {
          type: "incomingMessage",
          id: "31239223",
          content: "This isn't funny. You're not funny",
          username: "nomnom"
        },
      ]
    };
  }
  componentDidMount() {
  console.log("componentDidMount <App />");
  setTimeout(() => {
    console.log("Simulating incoming message");
    // Add a new message to the list of messages in the data store
    const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
    const messages = this.state.messages.concat(newMessage)
    // Update the state of the app component.
    // Calling setState will trigger a call to render() in App and all child components.
    this.setState({messages: messages})
  }, 3000);
};
  render() {
    const messageList = <MessageList message={this.state.messages}/>
    return (
      <div>
      <h1> Chatty🤗 </h1>
      {messageList}
      <ChatBar currentUser={this.state.currentUser}/ >
      </div>
    );
  }
}
export default App;