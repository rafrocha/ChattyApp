import React, { Component } from 'react';

class ChatBar extends Component {
  focus = (event) => {
    event.preventDefault();
    this.nameInput.focus();
  }
  render() {
    const color = this.props.currentUser.color;
    return (
    <footer className="chatbar" >
      <form onSubmit={(event) => { this.props.changeUser(event); this.focus(event); }}>
      <input className="chatbar-username"
      placeholder="Your Name (Optional)" defaultValue={this.props.currentUser.name}  name="chatName"/ >
      </form>
      <form className="message-form" onSubmit={this.props.onSubmit}>
      <input ref={(input) => { this.nameInput = input; }} className="chatbar-message"
      placeholder="Type a message and hit ENTER" name="chatMessage"/>
      </form>
      </footer>
    );
  }
}

export default ChatBar;