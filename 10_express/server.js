const express = require('./express');

const app = express();

// v4: 支持中间件
/* 中间件可以做的事：
  1. 权限验证
  2. 配置公共方法和公共属性
  3. 如果不调用next方法 则不会继续向下执行
  4. 一般中间件都在路由之前
  5. 如果中间件next方法中传递参数了 我们就认为这个参数是错误信息 需要不停往下传
*/
app.use(function(req, res, next) {
  console.log('use 中间件');
  next();
});

app.use('/user', function(req, res, next) {
  console.log('/user 路由中间件');
  next();
})

app.get('/', function (req, res) {
  res.end('hello jerry.');
})

// 路由参数： [id, name]  [44, jerry]
// /user/:id/:name this.$route.params

app.get('/user/:id/:name', function(req, res, next) {
  next('用户名获取失败')
  res.end(JSON.stringify(req.params));
})

app.post('/login', function(req, res) {
  res.end('登录成功');
})

// 全局匹配中间件 all + *
// 所有方法 + 所有路径
app.all('*', function(req, res) {
  res.end('404');
})

app.use(function(err, req, res, next) {
  console.log('我是兜底函数1', err)
  next(err)
})

app.use(function(err, req, res, next) {
  console.log('我是兜底函数2')
  console.log(err)
  res.end('500~~~~' + err)
})

app.listen(4444, function () {
  console.info('[Server] http://127.0.0.1:4444');
})
