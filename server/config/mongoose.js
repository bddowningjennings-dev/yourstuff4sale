const
  mongoose = require('mongoose')

module.exports = (DATABASE) => {
  mongoose.connect(`mongodb://localhost/${DATABASE}`)
  .then(() => console.log(`(database): connected to ${DATABASE}...`))
  .catch(err => console.log(err))
}