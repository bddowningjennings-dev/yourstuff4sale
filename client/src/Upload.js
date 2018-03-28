import React, { Component } from 'react';
import Notelist from './Notelist';
import './Upload.css';

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props.card,
      visible: false
    }
  }
  JSONbody = (state) => {
    return JSON.stringify({ ...state })
  }
  handleComplete = (event) => {
    let up_id = this.state._id
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    fetch(`/users/${user}/uploads/${up_id}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      method: 'put',
      body: this.JSONbody({
        complete: !this.state.complete
      }),
    })
    .then(data => data.json())
    .then(upload => {
      this.setState({
        complete: upload.complete
      })
      this.props.updateUpload(upload)
    })
    .catch(err=>console.log(err))
  }
  handleRemove = (event) => {
    if (this.props.removeUpload) {
      let up_id = this.state._id
      let token = localStorage.getItem('token')
      let user = localStorage.getItem('user')
      fetch(`/users/${user}/uploads/${up_id}`, {
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
        method: 'delete',
      })
      .then(data => data.json())
      .then(upload => {
        this.props.removeUpload(upload._id)
      })
      .catch(err=>console.log(err))
    }
  }
  handleShow = (event) => {
    let { _id } = this.state
    let upload = document.getElementById(`upload_${_id}`)
    if (upload.classList.contains('hidden')) {
      upload.classList.remove('hidden')
    } else {
      upload.classList.add('hidden')
    }
  }
  handleClear = (event) => {
    let Note_list = document.getElementById(`Note_list_${this.state._id}`)
    if (Note_list.classList.contains('hidden')) {
      Note_list.classList.remove('hidden')
    } else {
      Note_list.classList.add('hidden')
    }
    // let up_id = this.state._id
    // let token = localStorage.getItem('token')
    // let user = localStorage.getItem('user')
    // fetch(`/users/${user}/uploads/${up_id}`, {
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }),
    //   method: 'put',
    //   body: this.JSONbody({
    //     clear: !this.state.clear
    //   }),
    // })
    // .then(data => data.json())
    // .then(upload => {
    //   this.setState({
    //     clear: upload.clear
    //   })
    //   this.props.updateUpload(upload)
    // })
    // .catch(err=>console.log(err))
  }
  handleNote = (event) => {
    let up_id = this.state._id
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    let notes = this.state.notes
    let note_input = document.getElementById(`note_input_${up_id}`)
    let time = new Date().getTime()
    let new_note = ''
    let clear = true
    if (!this.props.isAdmin) {
      new_note = "Client note: "
    } else {
      clear = !this.state.clear
      new_note = "Admin note: "
    }
    new_note += `${dateFormat(time)} - ${note_input.value}`
    notes.push(new_note)
    note_input.value = ''
    fetch(`/users/${user}/uploads/${up_id}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      method: 'put',
      body: JSON.stringify({ notes, clear: `${ clear }` })
    })
    .then(data => data.json())
    .then(upload => {
      this.setState({
        clear: upload.clear
      })
      this.props.updateUpload(upload)
    })
    .catch(err=>console.log(err))
  }
  render() {
    let card = { ...this.state }
    let complete_status = card.complete?"complete":"active"
    let clear_status = card.clear?"clear":"active"
    let date = dateFormat(card.createdAt)
    let buttons = null, price_range = null
    if (this.props.isAdmin) {
      buttons = (
        <div className="upload_buttons">
          <button
            id={`clear-${ card._id }`}
            onClick={this.handleClear}>
            Mark <br /> Sold
          </button>
          <button
            id={`complete-${card._id}`}
            onClick={this.handleComplete}>
            Mark <br /> For Sale
          </button>
          <button
            id={`delete-${card._id}`}
            onClick={this.handleRemove}>
            Delete <br /> _
          </button>
        </div>
      )
    } else if (!card.clear) {
      buttons = (
        <button
          id={`clear-${ card._id }`}
          onClick={this.handleClear}>
          Mark <br /> Sold
        </button>
      )
    }
    if (card.priceHigh)
      price_range = (
        <div className="upload_prices" > Price Range: ${ card.priceLow } - { card.priceHigh } </div>
      )
    return (
      <div className={`Upload ${clear_status} ${complete_status}`}>
        <div className={`upload_title ${clear_status} title_buttons`}>
          <button onClick={ this.handleShow } >{ card.title }</button>
          {buttons}
        </div>
        <Notelist
          handleNote={ this.handleNote }
          id={ card._id } notes={ card.notes }
          className="hidden"
        />

        <div className="upload_date">{ date }</div>
        { card.photos.length } photo(s)
        <div id={`upload_${ card._id }`} className="upload_body hidden">
          <div className="upload_msg" >
            { card.msg }
          </div>
          {/* <div className="upload_id" > Upload #: { card._id }</div> */}
          { price_range }
          {/* <button className="disabled" disabled>
            Add Notes {`${card._id}`}
          </button>
          <button className="disabled" disabled>
            Email {`${card._id}`}
          </button> */}

          <div className="photos">
            { card.photos.map((photo, i) => {
              return <img
                        className="photo"
                        key={i} width="500px"
                        alt={`${photo}`}
                        src={`${photo}`} />
            })}
          </div>
        </div>
      </div>
    )
  }
}

const dateFormat = (date) => {
  let today = new Date(date)
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!
  let yyyy = today.getFullYear()
  let hour = today.getHours() % 12
  if (hour === 0)
    hour = 12
  let min = today.getMinutes()
  let aorp = 'AM'
  if (today.getHours() >= 12 && today.getHours() < 24)
    aorp = 'PM'
    if(dd<10)
        dd='0'+dd
    if(mm<10)
        mm='0'+mm
  return mm+'/'+dd+'/'+yyyy+'  '+hour+':'+min+" "+aorp;
}

export default Upload;
