import React, { Component } from 'react';
import './Notelist.css'

class Notelist extends Component {
  render() {
    return (
      <div
        id={ `Note_list_${this.props.id}` }
        className={`Notelist ${ this.props.className }`} >
        <textarea
          className="note_input"
          id={ `note_input_${this.props.id}` }
          type="text" name="notes"
          placeholder="Leave Note:"
        />
        <button 
          onClick={ this.props.handleNote }
          id={ `note_${this.props.id}` }> 
            Submit
        </button>

       { this.props.notes.map((note, i) => {
         return <p className="note" key={i}> { note } </p>
       }) }
      </div>
    )
  }
}

export default Notelist;
