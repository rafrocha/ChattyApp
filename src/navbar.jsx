import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    let users = "users";
    let online = this.props.onlineUsers;
    console.log(online);
    if(this.props.onlineUsers.length == 1){
      users = "user";
    } else if (this.props.onlineUsers.length > 1){
      online = this.props.onlineUsers.join(", ");
    }
    const size = this.props.onlineUsers.length;
    return (
       <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="onlineUsers">{size} {users} online</span>
          <span className="onlineUsers"> {online} </span>
      </nav>
    );}
}

export default NavBar;