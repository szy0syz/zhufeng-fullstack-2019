const express = require('./express');

const app = express();

app.get('/', function (req, res) {
  res.end('hello jerry.');
})

app.post('/login', function(req, res) {
  res.end('登录成功');
})

// 全局匹配中间件 all + *
// 所有方法 + 所有路径
app.all('*', function(req, res) {
  res.end('404');
})

app.listen(4444, function () {
  console.info('[Server] http://127.0.0.1:4444');
})
