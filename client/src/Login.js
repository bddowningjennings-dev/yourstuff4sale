import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
  }
  JSONbody = (state) => {
    return JSON.stringify({
    ...state
  })}
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  handleSubmit = (event) => {
    fetch('/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(this.state)
    })
    .then(res => {
      return res.json()})
    .then(data => {
      if (!data.token) return null
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', data.userId)
      localStorage.setItem('profile_img', data.profile_img)
      this.props.handleLogin(data.admin)
    })
    .catch(err => console.log(err))
    event.preventDefault()
  }
  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <input
            id="login_input"
            onChange={this.handleChange}
            type='email'
            name='email'
            placeholder='Email'
          />
          <button id="login_button" type='submit'>Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
