const
  UPLOAD_PATH = './public/static/uploads',
  multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${UPLOAD_PATH}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
  }
})

module.exports = multer({ storage: storage })