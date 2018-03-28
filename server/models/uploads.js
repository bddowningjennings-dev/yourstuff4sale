const
  mongoose = require('mongoose')

const UploadSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    required: true
  },
  photos_long: {
    type: [String],
    required: true
  },
  msg: {
    type: String,
    required: true
  },
  tracking_no: {
    type: Number,
    // required: true
  },
  title: {
    type: String,
    required: true
  },
  priceHigh: {
    type: Number,
  },
  priceLow: {
    type: Number,
  },
  notes: {
    type: [String]
  },
  complete: {
    type: Boolean,
    default: false
  },
  clear: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Upload', UploadSchema)