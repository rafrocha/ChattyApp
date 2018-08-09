import React, { Component } from 'react';

class ChatBar extends Component {
  render() {
    console.log(this.props);
    return (
    <footer className="chatbar" >
      <form onSubmit={this.props.changeUser}>
      <input className="chatbar-username"
      placeholder="Your Name (Optional)" defaultValue={this.props.currentUser.name} name="chatName"/ >
      </form>
      <form onSubmit={this.props.onSubmit}>
      <input className="chatbar-message"
      placeholder="Type a message and hit ENTER" name="chatMessage"/>
      </form>
      </footer>
    );
  }
}

export default ChatBar;