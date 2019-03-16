var express = require('./express')
var app = express()

app.get('/', function (req, res) {
  res.end('Hello World')
})

app.post('/login', function(req, res) {
  res.end(JSON.stringify({success: true, msg: '登录成功'}))
})

app.get('/user/:id/:name', function(req, res) {
  res.end(JSON.stringify(req.params));
})

app.all('*', function(req, res) {
  res.end('all + *');
})

app.listen(3000, function() { console.log('http://127.0.0.1:3000') });