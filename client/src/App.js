import React, { Component } from 'react';
import Header from './Header.js';
import Login from './Login.js';
import Content from './Content.js';
import Admin from './Admin.js';
import './polyfills.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      isAdmin: false
    }
  }
  componentWillMount() {
    this.setState({
      isLoggedIn: localStorage.getItem('token') || false,
      isAdmin: localStorage.getItem('admin') || false
    })
  }
  handleLogout = (event) => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    localStorage.removeItem('profile_img')
    this.setState({isLoggedIn: false})
    event.preventDefault()
  }
  handleLogin = (isAdmin) => {
    if (isAdmin)
      localStorage.setItem('admin', true)
    let state = { isLoggedIn: true, isAdmin: isAdmin || false }
    this.setState({ ...state })
  }
  // test = (event) => {
  //   event.preventDefault()
  //   let token = localStorage.getItem('token')
  //   let user = localStorage.getItem('user')
  //   if (!user || !token) return null
  //   fetch(`/users/${user}`, {
  //     headers: new Headers({
  //       'Authorization': `Bearer ${token}`
  //     })
  //   })
  //   .then(res => res.json())
  //   .then(data => console.log(data))
  //   .catch(err=> console.log(err))
  // }
  render() {
    let content = null
    let { isLoggedIn, isAdmin } = this.state
    if (!isLoggedIn) {
      content = (
        <div className="container">
          <Header />        
          <Login handleLogin={ this.handleLogin }/>
        </div>
      )
    } else if (!isAdmin){
      content = (
        <div className="container">
          <Header handleLogout={this.handleLogout} />          
          <Content />
        </div>
      )      
    } else {
      content = (
        <div className="container">
          <Header handleLogout={this.handleLogout} />
          <Admin />
        </div>
      )
    }
    return (
      <div className="App">
        { content }
        {/* <button onClick={ this.test }>Test</button> */}
      </div>
    );
  }
}

export default App;
