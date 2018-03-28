import React, { Component } from 'react';
import './User.css';
import Upload from './Upload'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      uploads_full: [],
      filter: 'active',
      hidden: true,
      active_count: null,
      clear_count: null,
      complete_count: null,
      all_count: null
      
    }
  }
  componentWillMount() {
    let { user } = this.props
    let complete_type = user.uploads.filter(e => e.complete)
    let clear_type = user.uploads.filter(e => e.clear)
    let active_type = user.uploads.filter(e => (!e.complete && !e.clear))
    this.setState({
      uploads_full: user.uploads,
      uploads: user.uploads.filter(e => (!e.complete && !e.clear)),
      active_count: active_type.length,
      clear_count: clear_type.length,
      complete_count: complete_type.length,
      all_count: user.uploads.length
    })
  }
  filterOff = (e) => {
    this.setState({
      uploads: this.state.uploads_full,
      filter: 'off'
    })
  }
  filterActive = (e) => {
    this.setState({
      uploads: this.state.uploads_full.filter(upload=>
        (!upload.complete && !upload.clear)),
      filter: 'active'
    })
  }
  filterComplete = (e) => {
    this.setState({
      uploads: this.state.uploads_full.filter(upload => upload.complete),
      filter: 'complete'
    })
  }
  filterClear = (e) => {
    this.setState({
      uploads: this.state.uploads_full.filter(upload => upload.clear),
      filter: 'clear'
    })
  }
  toggleHidden = (event) => this.setState({ hidden: !this.state.hidden })
  removeUpload = (id) => {
    let { uploads, uploads_full } = this.state
    uploads_full = uploads_full.filter(e => e._id !== id)
    this.setState({
      uploads_full,
      uploads: uploads.filter(e => e._id !== id),
    })
    this.updateUpload(uploads_full[0] || null)
  }
  updateUpload = (upload) => {
    if (!upload) {
      return null
    }
    let others = this.state.uploads_full.filter(e => {
      return e._id !== upload._id
    })
    let new_uploads = [upload, ...others]
    let new_filtered = new_uploads

    // to count the types
    let complete_type = new_uploads.filter(e => e.complete)
    let clear_type = new_uploads.filter(e => e.clear)
    let active_type = new_uploads.filter(e => (!e.complete && !e.clear))

    if (this.state.filter === 'complete') {
      new_filtered = complete_type
    } else if (this.state.filter === 'clear') {
      new_filtered = clear_type    
    } else if (this.state.filter === 'active') {
      new_filtered = active_type     
    }
    this.setState({
      uploads: new_filtered,
      uploads_full: [upload, ...others],
      active_count: active_type.length,
      clear_count: clear_type.length,
      complete_count: complete_type.length,
      all_count: [upload, ...others].length
    })
  }
  render() {
    let { user } = this.props
    let { 
      uploads,
      hidden,
      clear_count,
      active_count,
      complete_count,
      all_count
    } = this.state
    uploads = uploads.sort((a,b) => {
      let a_date = new Date(a.updatedAt)
      let b_date = new Date(b.updatedAt)
      return b_date - a_date
    })
    let user_uploads = null
    if (!hidden) {
      user_uploads = (<div id={`uploads_${ user._id }`} className="user_uploads">
        <button onClick={ this.toggleHidden }>Hide</button>
        {uploads.map((element, i) =>
          <Upload
            isAdmin={true}
            key={element._id}
            card={element}
            removeUpload={this.removeUpload}
            updateUpload={this.updateUpload}
          />)}
      </div>)
    } else {
      user_uploads = (
        <button onClick={ this.toggleHidden }>Show</button>
      )
    }
    return (
      <div className="User">
        user ({ user.email }) content -here
        <p><b>{ user.uploads.length }</b> uploads in this stack</p>
        <div className='buttons'>
          <button onClick={this.filterActive}> New { active_count }</button>
          <button onClick={this.filterComplete}> Posted { complete_count }</button>
          <button onClick={this.filterClear}> Sold { clear_count }</button>
          <button onClick={this.filterOff}> All { all_count }</button>
        </div>
        { user_uploads }
      </div>
    );
  }
}

export default User;
