const
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  User = require('../models/users')

class UsersController {
  index(req, res) {
    let admin = false
    User.findById(req.params.id, (err, user) => {
      if (err) return res.json(err)
      if (process.env.ADMIN_EMAILS.split(' ').includes(`${user.email}`)) {
        User.find({}).populate('uploads').exec((err, users) => {
          if (err) return res.json(err)
          return res.json(users)
        })
      } else {
        return res.json({ error: 'not admin login'})
      }
    })
  }
  login(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.json(err)
      if (!user) {
        User.create(req.body, (err, user) => {
          if (err) return res.json(err)
          let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
          return res.json({ userId: user._id, email: user.email, token })
        })
      } else {
        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        if (process.env.ADMIN_EMAILS.split(' ').includes(`${user.email}`)) {
          let data = {
            admin: true,
            userId: user._id,
            email: user.email,
            profile_img: user.profile_img,
            token }
          return res.json(data)
        } else {
          let data = { 
            userId: user._id,
            email: user.email,
            profile_img: user.profile_img,
            token }
          return res.json(data)
        }
      }
    })
  }
  show(req, res) {
    User.findOne({_id: req.params.id})
    .populate('uploads')
    .exec((err, user) => {
      if (err) return res.json(err)
      return res.json(user)
    })
  }
  update(req, res) {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, user) => err ? res.json(err) : res.json(user))
  }
  destroy(req, res) {
    User.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) return res.json(err)
      return res.json(user)
    })
  }
}

module.exports = new UsersController()