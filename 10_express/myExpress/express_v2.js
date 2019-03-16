const url = require('url');
const http = require('http');
const methods = require('methods');

function application() {
  let app = function (req, res) {
    // 有请求来，比较路径与请求方法，匹配了，我就执行对应的路由
    const { pathname } = url.parse(req.url);
    const requestMethod = req.method.toLowerCase();
    for (let i = 0; i < app.routes.length; i++) {
      const { path, method, handler } = app.routes[i];
      if (
        (requestMethod === method || method === 'all')
        && 
        (pathname === path || path === '*')
        ) {
        return handler(req, res);
      }
    }
    res.end('Cannot Found')
  }

  app.routes = [];

  [...methods, 'all'].forEach(function (method) {
      app[method] = function(path, handler) {
        const layer = { path, method,handler };
        app.routes.push(layer);
      }
  })


  app.listen = function (port, handler) {
    const server = http.createServer(app);
    server.listen(port, handler);
  }

  return app;
}

module.exports = application;
