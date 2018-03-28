const
  jwt = require('jsonwebtoken'),
  uploader = require('../controllers/multer'),
  User = require('../controllers/user'),
  Upload = require('../controllers/upload')

module.exports = (app) => {
  app.post('/login', User.login)

  app.get('/users/:id', isLoggedIn, User.show)
  app.get('/admin/:id', isLoggedIn, User.index)
  app.post('/users/:id/photo', isLoggedIn, uploader.array('upl', 2), Upload.photo)
  app.post('/users/:id/uploads', isLoggedIn, Upload.create)
  app.delete('/users/:id/uploads/:up_id', isLoggedIn, Upload.destroy)
  app.put('/users/:id/uploads/:up_id', isLoggedIn, Upload.update)
}

const isAuthorized = (req) => {
  if (!req.headers.authorization) return false
  let client_token = req.headers.authorization.split(' ')[1]
  return jwt.verify(client_token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return false
    return (decoded.userId === req.params.id)
  })
}
const isLoggedIn = (req, res, next) => {
  if (isAuthorized(req)) return next()
  return res.json({error: 'Auth error'})
}
