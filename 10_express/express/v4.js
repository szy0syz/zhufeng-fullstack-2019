const url = require('url');
const http = require('http');
const methods = require('methods');

function application() {
  let app = (req, res) => {
    const { pathname } = url.parse(req.url); // 可以有请求参数等
    const requestMethod = req.method.toLowerCase();

    // 此时 routes：[use, use, route, route-404]
    let index = 0;
    function next(err) {
      if (index >= app.routes.length) {
        res.statusCode = 404;
        return res.end(`Cannot ${requestMethod.toUpperCase()} ${pathname}`);
      }

      const { method, path, handler } = app.routes[index++];
      if (err) {
        if (method === 'middleware' && handler.length === 4) {
          return handler(err, req, res, next);
        } else {
          next(err);
        }
      } else {
        if (method === 'middleware') {
          // 路径相同 和 路径是/ 和路径开头一样也匹配
          // "/"  "/user" "/user/44/jerry"
          if (pathname === path || path === '/' || pathname.startsWith(path + '/')) {
            return handler(req, res, next); // 将next的执行方法交给用户 由用户决定是否向下执行
          } else {
            next();
          }
        } else {
          // 为动态路由赋值
          if (path.params) {
            const matches = pathname.match(path);
            if (matches) {
              let [, ...lists] = matches;
              req.params = path.params.reduce((memo, arg, index) => (memo[arg] = lists[index], memo), {});
              return handler(req, res, next);
            }
          }
  
          if ((pathname === path || path === '*') && ((requestMethod === method) || method === 'all')) {
            // 如果找到了对应的路径与请求方法，就执行回调并返回，不再往下找
            return handler(req, res, next);
          }
  
          next();
        }
      }
    }
    next();
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
        path = path.replace(/:([^\/]*)/g, function () {
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
  });

  // 开始处理use中间件
  app.use = function (path, handler) {
    // 处理中间件参数，如果没传path，默认是 /
    if (typeof handler !== 'function') {
      // 如果 handler 不是函数，我们就认为没传专用的 监听函数，则认为path等于默认的 /，匹配全局
      // 其实这个时候 path 就是我们要的handler，提前做
      handler = path;
      path = '/';
    }
    const layer = {
      method: 'middleware',
      path,
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