const url = require('url');
const http = require('http');

function application() {
  let app = (req, res) => {
    let { pathname } = url.parse(req.url); // 可以有请求参数等
    let requestMethod = req.method.toLowerCase();
    for (let i = 0; i < app.routes.length; i++) {
      const layer = app.routes[i];
      const { path, handler, method } = layer;
      if (pathname === path && requestMethod === method) {
        // 如果找到了对应的路径与请求方法，就执行回调并返回，不再往下找
        return handler(req, res);
      }
    }
    // 如果没有任何路由被匹配就执行默认方法
    res.end(`Cannot ${requestMethod.toUpperCase()} ${pathname}`);
  }

  // 存路由
  app.routes = [];

  // 保存 get 请求方法的操作
  app.get = function (path, handler) {
    let layer = {
      path,
      method: 'get',
      handler,
    };
    app.routes.push(layer);
  }

  app.listen = function (port, handler) {
    const server = http.createServer(app);
    server.listen(port, handler);
  }

  return app;
}

module.exports = application;