const
  mailer = require('../controllers/mailer'),
  mongoose = require('mongoose'),
  Upload = require('../models/uploads'),
  User = require('../models/users')

class UploadController {
  index(req, res) {
    Upload.find({}, (err, uploads) => {
      if (err) return res.json(err)
      return res.json(uploads)
    })
  }
  photo(req, res) {
    return res.json({files: {
      filename: req.files[0].filename,
      path: req.files[0].path
    }})
  }
  create(req, res) {
    let photos = [], photos_long = [], attachments = []
    let html = `<p>${ req.params.id }</p><p>${req.body.title}</p><p>${req.body.msg}</p>`
    for (let file of req.body.files) {
      photos_long.push(__dirname + '/../../' + file.path)
      photos.push('uploads/' + file.filename)
      attachments.push({
          filename: file.filename,
          path: __dirname + '/../../' + file.path,
          cid: file.filename
      })
      html += `<p><img style="width:500px" src="cid:${file.filename}"/></p>`
    }
    req.body.photos = photos
    req.body.photos_long = photos_long
    req.body.user = req.params.id
    Upload.create(req.body, (err, upload) => {
      if (err) return res.json(err)
      User.findOne({_id: req.params.id}, (err, user) => {
        user.uploads.push(upload._id)
        user.save()
        html = `<p>${user.email}</p>` + html
        let body = { html, attachments }
        mailer('yourstufffoursale@gmail.com', body)
      })
      return res.json(upload)
    })
  }
  show(req, res) {
    Upload.findOne({ _id: req.params.up_id }, (err, upload) => {
      if (err) return res.json(err)
      return res.json(upload)
    })
  }
  destroy(req, res) {
    if (!isGranted(req.params.id, req.params.up_id))
      return res.json({ error: 'not granted'})
    Upload.findByIdAndRemove(req.params.up_id, (err, upload) => err ? res.json(err) : res.json(upload))
  }
  update(req, res) {
    if (!isGranted(req.params.id, req.params.up_id))
      return res.json({ error: 'not granted'})
    Upload.findByIdAndUpdate(req.params.up_id, { $set: req.body }, { new: true }, (err, upload) => {
      return err ? res.json(err) : res.json(upload)})
  }
}

const isGranted = (id, up_id) => {
  if (isAdmin(id)) return true
  return Upload.findById(up_id, (err, upload) =>{
    return (id === upload.user)
  })
}
const isAdmin = (id) => {
  return User.findById(id, (err, user) => {
    if (err || !user) return false
    return (process.env.ADMIN_EMAILS.split(' ').includes(`${user.email}`))
  })
}
module.exports = new UploadController()