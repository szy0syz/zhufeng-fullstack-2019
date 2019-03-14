const express = require('./express');
const path = require('path')
const app = express();


app.get('/', function (req, res) {
  console.log(req.path, req.query);
  res.send({name: 'jerry', age: req.query.age || 18});
})

app.get('/name', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'name.html'));
})

app.listen(4444, function () {
  console.info('[Server] http://127.0.0.1:4444');
})
