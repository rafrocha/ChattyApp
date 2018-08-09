import React, { Component } from 'react';

class Message extends Component {
  render() {
    console.log(this.props)
    const userName = this.props.message.username;
    if(this.props.message.type === "incomingMessage"){
    return (
      <div className="message">
      <span className="message-username"> { userName } </span>
      <span className="message-content"> { this.props.message.content } </span>
      </div>
    );
  } else if(this.props.message.type === "incomingNotification"){
      return(
      <div className="message system">{ this.props.message.content }</div>
      )
    }
  }
}

export default Message;