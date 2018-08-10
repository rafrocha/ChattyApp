import React, { Component } from 'react';

class Message extends Component {
  render() {
    const userName = this.props.user;
    const currentUser = this.props.currentUser;
    const color = this.props.message.color;
    if(this.props.message.type === "incomingMessage"){
      if(userName !== currentUser){
    return (
      <div className="message">
      <div className="combine-message">
      <span className="message-username" style={{color:color}}> { userName } </span>
      <span className="message-content"> { this.props.message.content }</span>
      </div>
      </div>
    );
  } else if (userName === currentUser){
    return (
      <div className="message-current">
      <div className="combine-message-current">
      <span className="message-username" style={{color:color}}> { userName } </span>
      <span className="message-content"> { this.props.message.content } </span>
      </div>
      </div>
    );
    }
  } else if(this.props.message.type === "incomingNotification" || this.props.message.type === "WelcomeMSG" ){
      return(
      <div className="message system">{ this.props.message.content }</div>
      );
    }
  }
}

export default Message;