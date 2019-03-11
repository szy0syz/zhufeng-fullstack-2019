const express = require('./express');

const app = express();

app.get('/', function (req, res) {
  res.end('hello, jerry.');
})

try {
  app.listen(4444, function () {
    console.info('[Server] http://127.0.0.1:4444');
  })
} catch (error) {
  console.error(error);
}
