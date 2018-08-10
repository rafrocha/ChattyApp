import React, { Component } from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  componentDidUpdate() {
      this.newData.scrollIntoView({ behavior: "smooth" })
  }
  render(){
    const messageItems = this.props.message.map(message => (
      <Message key={message.id} message={message} currentUser={this.props.user} user={message.username} />
    ));
    return (
      <main className="messages">
        {messageItems}
        <div ref={(ref) => this.newData = ref}></div>
      </main>
    );
  }
}
export default MessageList;