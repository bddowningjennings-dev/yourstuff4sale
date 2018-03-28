import React, { Component } from 'react';
import PhotoPicker from './PhotoPicker'
// import Price from './Price';
import './Uploader.css';

class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      msg: '',
      price_range: '',
      priceHigh: 0,
      priceLow: 0,
      files: [],
      validRange: false      
    }
  }
  checkValidUpload = (state, recent = true, type = null) => {
    state[type] = recent
    let { title, msg, files } = state
    let submit = document.getElementById('submit')
    if (title && msg && files.length > 0) {
      if (submit.classList.contains('hidden'))
        submit.classList.remove('hidden')
    } else {
      if (!submit.classList.contains('hidden'))
        submit.classList.add('hidden')
    }
  }
  handleChange = (event) => {
    // this.checkValidUpload(this.state, event.target.value, [event.target.name])
    this.setState({[event.target.name]: event.target.value})
  }
  getFile = (file) => {
    let others = this.state.files.filter( e => {
      return e.picker !== file.picker
    })
    this.setState({
      files: [file, ...others]
    })
    // this.checkValidUpload(this.state)
  }
  handleSubmit = (event) => {
    event.preventDefault()
    // document.getElementById('priceHigh').value = this.state.priceHigh
    // document.getElementById('priceLow').value = this.state.priceLow
    let { title, msg, files } = this.state
    // let submit = document.getElementById('submit')
    // if ( !title || !msg )
    if (!title || !msg || files.length === 0)
      return null
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    fetch(`/users/${user}/uploads`, {
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      method: 'post',
      body: JSON.stringify({
        ...this.state
      })
    })
    .then(data => data.json())
    .then(upload => {
      this.setState({
        title: '',
        msg: '',
        price_range: '',
        priceHigh: 0,
        priceLow: 0,
        files: [],
        validRange: false
      })
      this.props.addUpload(upload)
      this.props.filterActive(null)
      document.getElementById('upload_toggler').innerHTML = "New Upload"
    })
    .catch(err=>console.log(err))
  }
  render() {
    let pickers = new Array(8).fill(true)
    return (
      <div className="Uploader">
        <div id="preview">
          {pickers.map( (e, i) => {
            return <PhotoPicker key={i} id={i} getFile={this.getFile} />
          })}
        </div>
        <form id="uploader_form"
          onSubmit={this.handleSubmit}
          >


          <input
            type="text"
            name="title"
            placeholder="Title (Required)"
            onChange={this.handleChange}
          />
          <textarea
            name="msg" id="msg"
            cols="140" rows="12"
            placeholder="Add Description (Required)"
            onChange={this.handleChange}
          />
          {/* <Price /> */}
          <div className="submit_row">
            <button 
              id="submit"
              // className="btn_submit hidden"
              className="btn_submit"
              type="submit">Upload</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Uploader;
