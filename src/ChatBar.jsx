import React, { Component } from 'react';

class ChatBar extends Component {
  render() {
    return (
    <footer className="chatbar" >
    <form onSubmit={this.props.onSubmit}>
      <input className="chatbar-username"
      placeholder="Your Name (Optional)" defaultValue={this.props.currentUser.name} name="chatName"/ >
      <input className="chatbar-message"
      placeholder="Type a message and hit ENTER" name="chatMessage"/>
      <input style={{ display: "none" }} type="submit" />
      </form>
      </footer>
    );
  }
}

export default ChatBar;