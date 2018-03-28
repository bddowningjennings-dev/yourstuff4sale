import React, { Component } from 'react';
import Upload from './Upload'
import Uploader from './Uploader.js';
import './Content.css';


class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      uploads_full: [],
      filter: 'active',
      active_count: null,
      clear_count: null,
      complete_count: null,
      uploader_visible: false
    }
  }
  componentWillMount() {
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    fetch(`/users/${user}`, {
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    })
    .then(res => res.json())
    .then(user => {
      if (!user.uploads) return null
      let uploads = user.uploads.sort((a,b) => {
        let a_date = new Date(a.updatedAt)
        let b_date = new Date(b.updatedAt)
        return b_date - a_date
      })
      let complete_type = uploads.filter(e => e.complete)
      let clear_type = uploads.filter(e => e.clear)
      let active_type = uploads.filter(e => (!e.complete && !e.clear))
      this.setState({
        uploads_full: uploads,
        uploads: uploads.filter(e => (!e.complete && !e.clear)),
        active_count: active_type.length,
        clear_count: clear_type.length,
        complete_count: complete_type.length,
        sort_type: "new",        
        profile_img: user.profile_img,
        email: user.email
      })
    })
    .catch(e => console.log(e))
  }
  filterOff = (e) => {
    this.setState({
      uploads: this.state.uploads_full,
      filter: 'off',
      sort_type: 'all'
    })
  }
  filterActive = (e) => {
    this.setState({
      uploads: this.state.uploads_full.filter(upload=>
        (!upload.complete && !upload.clear)),
      filter: 'active',
      sort_type: 'new'
    })
  }
  filterComplete = (e) => {
    this.setState({
      uploads: this.state.uploads_full.filter(upload => upload.complete),
      filter: 'complete',
      sort_type: 'posted'
    })
  }
  filterClear = (e) => {
    this.setState({
      uploads: this.state.uploads_full.filter(upload => upload.clear),
      filter: 'clear',
      sort_type: 'sold'
    })
  }
  toggleUploader = (event) => {
    this.setState({ uploader_visible: !this.state.uploader_visible })
    const upload_toggler = document.getElementById('upload_toggler')
    if (this.state.uploader_visible) {
      upload_toggler.innerHTML = "New Upload"
    } else {
      upload_toggler.innerHTML = "Cancel Upload"
    }
  }
  addUpload = (upload) => {
    this.setState({
      uploads: [upload, ...this.state.uploads],
      uploads_full: [upload, ...this.state.uploads_full],
      uploader_visible: false
    })
    this.updateUpload(upload)
  }
  updateUpload = (upload) => {
    let others = this.state.uploads_full.filter(e => {
      return e._id !== upload._id
    })
    let new_uploads = [upload, ...others]
    let new_filtered = new_uploads
    let sort_type = "all"
    // to count the types
    let complete_type = new_uploads.filter(e => e.complete)
    let clear_type = new_uploads.filter(e => e.clear)
    let active_type = new_uploads.filter(e => (!e.complete && !e.clear))

    if (this.state.filter === 'complete') {
      new_filtered = complete_type
      sort_type = "posted"
    } else if (this.state.filter === 'clear') {
      new_filtered = clear_type    
      sort_type = "sold"
    } else if (this.state.filter === 'active') {
      new_filtered = active_type     
      sort_type = "new"
    }
    this.setState({
      uploads: new_filtered,
      uploads_full: [upload, ...others],
      active_count: active_type.length,
      clear_count: clear_type.length,
      complete_count: complete_type.length,
      sort_type: sort_type
    })
  }
  render() {
    let { 
      uploads,
      uploads_full,
      clear_count,
      active_count,
      complete_count,
      profile_img,
      email,
      uploader_visible,
      sort_type
    } = this.state
    let uploader_show = null
    if (uploader_visible) {
      uploader_show = (
        <Uploader
          addUpload={ this.addUpload }
          filterActive={ this.filterActive } 
        />
      )
    }
    return (
      <div className="Content">
        <div
          style={{backgroundImage: `url(${profile_img})`}}
          className="profile_img" >
        </div>
        <div id="uploader_tray" className={ sort_type } >
          <h1 id="user_email"> { email } </h1>
          <div id="sort_buttons" className='buttons'>
            <button className="sorter new" onClick={this.filterActive}>
              <div className="sort_count"> { active_count } </div>
              <div className="sort_title"> New </div>
            </button>
            <button className="sorter posted" onClick={this.filterComplete}>
              <div className="sort_count">{ complete_count }</div>
              <div className="sort_title"> For Sale </div>
            </button>
            <button className="sorter sold" onClick={this.filterClear}>
              <div className="sort_count">{ clear_count }</div>
              <div className="sort_title"> Sold </div>
            </button>
            <button className="sorter all" onClick={this.filterOff}>
              <div className="sort_count">{ uploads_full.length }</div>
              <div className="sort_title"> All </div>
            </button>
          </div>
          <div id="below_sorters" >
            <button
              id="upload_toggler"
              onClick={this.toggleUploader}>
              New Upload
            </button>
            { uploader_show }
          </div>
        </div>
        <div id="uploads" className={ sort_type } >
          {uploads.map((element, i) =>
            <Upload
              key={element._id}
              card={element}
              removeTask={this.removeTask}
              updateUpload={this.updateUpload}  
              />)}
        </div>
      </div>
    );
  }
}

export default Content;
