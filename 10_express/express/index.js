const url = require('url');
const http = require('http');
const methods = require('methods');

function application() {
  let app = (req, res) => {
    let { pathname } = url.parse(req.url); // 可以有请求参数等
    let requestMethod = req.method.toLowerCase();
    for (let i = 0; i < app.routes.length; i++) {
      const layer = app.routes[i];
      const { path, handler, method } = layer;
      
      // 为动态路由赋值
      if (path.params) {
        const matches = pathname.match(path);
        if (matches) {
          let [, ...lists] = matches;
          req.params = path.params.reduce((memo, arg, index) => (memo[arg] = lists[index], memo), {});
          return handler(req, res);
        }
      }

      if ((pathname === path || path === '*') && ((requestMethod === method) || method === 'all')) {
        // 如果找到了对应的路径与请求方法，就执行回调并返回，不再往下找
        return handler(req, res);
      }
    }
    // 如果没有任何路由被匹配就执行 默认方法
    res.end(`Cannot ${requestMethod.toUpperCase()} ${pathname}`);
  }

  // 存路由
  app.routes = [];

  // 遍历所有可能存在的http请求方法，并挂载到app这个函数上，使得我们在用.get/.delete/.head添加监听函数时都能与之对应到正确的http方法
  // 同时还需加入all方法
  [...methods, 'all'].forEach(method => {
    app[method] = function (path, handler) {
      // 处理动态路由
      let params = [];
      if (path.includes(':')) {
        path = path.replace(/:([^\/]*)/g, function() {
          params.push(arguments[1]);
          return '([^\/]*)'
        });
        path = new RegExp(path);
        path.params = params; // 将匹配出来的对象挂到自己身上
      }
      let layer = {
        path,
        method,
        handler,
      };
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