require('dotenv').load()
const
  PORT = 8000,
  DATABASE = 'ys4s-githubdemo',
  bodyParser = require('body-parser'),
  express = require('express'),
  app = express()

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/build/index.html')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true, limit: '25mb'}));
app.use(express.static(__dirname + '/public/static'))

require('./server/config/mongoose')(DATABASE)
require('./server/config/routes')(app)

app.get('/*', (req, res) => {
  return res.redirect('/')
})

app.listen(PORT, () => console.log(`(server): listening on port ${PORT}...`))