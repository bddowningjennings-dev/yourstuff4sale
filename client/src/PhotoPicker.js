import React, { Component } from 'react';
import './PhotoPicker.css';

class PhotoPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleFiler = (event) => {
    const send = (blob) => {
      let token = localStorage.getItem('token')
      let user = localStorage.getItem('user')
      let fd = new FormData();
      fd.append('upl', blob, 'blobby');
      fetch(`/users/${user}/photo`, {
        headers: new Headers({
          'Authorization': `Bearer ${token}`
        }),
        method: 'post',
        body: fd
      })
      .then(data => {
        return data.json()
      })
      .then(image => {
        image.files.picker = this.props.id
        this.props.getFile(image.files)
      })
      .catch(err => console.log(err))
    }
    const sizedCanvas = (original) => {
      let
        canvas = document.createElement("canvas"),
        width = original.width,
        height = original.height
      const
        MAX_WIDTH = 900,
        MAX_HEIGHT = 900;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext("2d").drawImage(original, 0, 0, canvas.width, canvas.height)
      let picker = document.getElementById(`picker_${this.props.id}`)
      picker.style.backgroundImage = `url(${canvas.toDataURL()})`
      
      return canvas
    }
      let filer = document.getElementById(`filer_${this.props.id}`)
      filer.onchange = (event) => {
        event.preventDefault()
        let picker = document.getElementById(`picker_${this.props.id}`)
        picker.style.backgroundImage = `url("waiting.png")`
        if (this.props.id < 7) {
          let next_picker = document.getElementById(`picker_${this.props.id + 1}`)
          next_picker.classList.remove('disabled')
        }
        const reader = new FileReader()
        reader.onload = (event) => {
          let original = new Image()
          original.src = event.target.result
          original.onload = () => {
            let canvas = sizedCanvas(original)
            canvas.toBlob(send, 'image/jpeg', 0.9)
            }
          }
        reader.readAsDataURL(filer.files[0])
      }
    filer.click()
  }
  render() {
    let disabled = null
    if (this.props.id !== 0) {
      disabled = "disabled"
    }
    return (
      <div id={`picker_${this.props.id}`}
        className={`PhotoPicker preview ${disabled}`}
        style={{backgroundImage: `url("preview.png")`}}
        onClick={this.handleFiler}
      >
        <input
          id={`filer_${this.props.id}`}
          className="hide_file"
          type="file" accept="image/*"
          name={`${this.props.id}`}
          capture
        />
      </div>
    );
  }
}

export default PhotoPicker;
