import React, { Component } from 'react';

class Message extends Component {
  render() {
    console.log(this.props)
    const userName = this.props.message.username ? this.props.message.username : "Anonymous";
    return (
      <div className="message" >
      <span className="message-username" > {userName} </span>
      <span className="message-content" > {this.props.message.content}</span> <
      /div>
    );
  }
}

export default Message;