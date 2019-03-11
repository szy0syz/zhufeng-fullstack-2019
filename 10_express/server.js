const express = require('./express');

const app = express();

app.get('/', function (req, res) {
  res.end('hello jerry.');
})

// 仅匹配一次，不重复执行handler。
app.get('/', function (req, res) {
  res.end('hello jerry, too.');
})


app.listen(4444, function () {
  console.info('[Server] http://127.0.0.1:4444');
})
