import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  render() {
    let button = null
    let profile_img = localStorage.getItem('profile_img')
    if (profile_img === 'undefined' || profile_img === null) {
      profile_img = '/uploads/simply_thrift.png'
    }
    if (this.props.handleLogout) {
      button = (
        <button
          className="header_left" id="logout"
          onClick={ this.props.handleLogout }>
          <div
            style={{backgroundImage: `url(${profile_img})`}}            
            className="user_icon">
          </div>
          Logout
        </button>
      )
    } else {
      button = (
        <div className="spacer" ></div>        
      )
    }
    return (
      <div className="Header">
        <div className="title" >YOUR STUFF 4 SALE</div>
        <div className="spacer" ></div>
        { button }        
      </div>
    );
  }
}

export default Header;
