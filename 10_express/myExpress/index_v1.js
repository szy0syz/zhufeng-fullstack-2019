var express = require('./express')
var app = express()
 
app.get('/', function (req, res) {
  res.end('Hello World')
})
 
app.listen(3000, function() { console.log('http://127.0.0.1:3000') });