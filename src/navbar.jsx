import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    let users = "users";
    if(this.props.onlineUsers == 1){
      users = "user";
    }
    return (
       <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="onlineUsers">{this.props.onlineUsers} {users} online</span>
      </nav>
    );}
}

export default NavBar;