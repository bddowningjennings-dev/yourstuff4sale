import React, { Component } from 'react';

class Price extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price_range: '',
      priceHigh: 0,
      priceLow: 0,
      validRange: false
    }
  }
  handlePrice = (event) => {
    this.handleChange(event)
    if (!event.target.value) {
      this.setState({
        priceLow: 0,
        priceHigh: 0,
        validRange: false
      })
      return null
    }
    let range = event.target.value.split('').filter(val => {
      return (val === '-' || Number(val) || val === '0')
    }).join('')
    range = range.split('-').map(val => Number(val))
    if (range.length === 2 && range[1] !== ""){
      if (Number(range[0] && Number(range[1])))
        this.setState({
          priceLow: Number(range[0]),
          priceHigh: Number(range[1]),
          validRange: true
        })
    } else {
      this.setState({
        priceLow: 0,
        priceHigh: 0,
        validRange: false
      })
    }
  }
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  render() {
    let {
      validRange,
      priceLow,
      priceHigh,
      price_range
    } = this.state
    let price_msg = null
    if (validRange) {
      price_msg = (
        <div className="price_msg">
          <span>Price Low: { priceLow } </span>
          <span>Price High: { priceHigh }</span>
        </div>
      )
    } else if (price_range !== '') {
      price_msg = (
        <div className="price_msg">
          Please enter valid range
        </div>        
      )
    }
    return (
    <div className="prices">
      <input id="priceLow" className="hidden" name="priceLow" />
      <input id="priceHigh" className="hidden" name="priceHigh" />
      <input
        type="text"
        name="price_range"
        placeholder="Price Range: (ex: $20-45)"
        onChange={this.handlePrice}
      />
      { price_msg }
    </div>
    );
  }
}

export default Price;
