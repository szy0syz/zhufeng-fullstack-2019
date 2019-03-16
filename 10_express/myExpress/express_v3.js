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
      // 开新分支 比较动态路由
      if (path.params) {
        // 这个时候path存的是正则
        const matches = pathname.match(path);
        if (matches) {
          const [, ...lists] = matches;
          // params: [id, name]
          // lists: ['123', 'jerry']
          req.params = path.params.reduce((memo, arg, index) => (memo[arg] = lists[index], memo), {})
          return handler(req, res);
        }
      }
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
        // 判断path是否含 :
        if (path.includes(':')) {
          // '/user/:id/:name'
          const params = []
          path = path.replace(/:([^\/]*)/g, function() {
            // arguments: ['all~~', '小分组1']
            params.push(arguments[1])
            return '([^\/]*)';
          })
          path = new RegExp(path);
          path.params = params;
        }
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
