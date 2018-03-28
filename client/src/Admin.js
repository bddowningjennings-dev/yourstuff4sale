import React, { Component } from 'react';
import './Admin.css';
import User from './User';

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }
  componentWillMount() {
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    fetch(`/admin/${user}`, {
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(users => {
      if (!users) return null
      users = users.filter(e => e.uploads.length > 0)
      this.setState({ users })
    })
    .catch(e => console.log(e))
  }
  render() {
    return (
      <div className="Admin">
        {this.state.users.map(element => {
          return <User key={ element._id } user={ element } />
        })}
      </div>
    );
  }
}

export default Admin;
