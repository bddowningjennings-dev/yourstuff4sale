const
  mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  profile_img: {
    type: String,
    default: '/uploads/simply_thrift.png'
  },
  uploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload'
  }]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)