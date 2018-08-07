import React, { Component } from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
render(){
  console.log(this.props);
   const messageItems = this.props.message.map(message => (
      <Message key={message.id} message={message} />
    ));
    return (
      <main className="messages" >
      {messageItems}
      </main>
    );
  }
}
export default MessageList;