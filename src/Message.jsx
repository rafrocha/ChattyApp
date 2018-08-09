import React, { Component } from 'react';

class Message extends Component {
  render() {
    console.log(this.props.message.color)
    const userName = this.props.message.username;
    const color = this.props.message.color;
    if(this.props.message.type === "incomingMessage"){
    return (
      <div className="message">
      <span className="message-username" style={{color:color}}> { userName } </span>
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