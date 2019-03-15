const url = require('url');
const http = require('http');

function application() {
  let app = function(req, res) {
    // 有请求来，比较路径与请求方法，匹配了，我就执行对应的路由
    const { pathname } = url.parse(req.url);
    const requestMethod = req.method.toLowerCase();
    for(let i=0;i<app.routes.length;i++) {
      const { path, method, handler } = app.routes[i];
      if (requestMethod === method && pathname === path) {
        return handler(req, res);
      }
      res.end('Cannot Find')
    }
  }

  app.routes = []

  app.get = function(path, handler) {
    const layer = {
      path,
      method: 'get',
      handler,
    }
    app.routes.push(layer);
  }

  app.listen = function(port, handler) {
    const  server = http.createServer(app);
    server.listen(port, handler);
  }

  return app;
}

module.exports = application;











// const url = require('url');
// const http = require('http');
// function application() {
//   let app = function(req, res) {
//     const { pathname } = url.parse(req.url);
//     const requestMethod = req.method.toLowerCase();
//     for(let i = 0; i < app.routes.length; i++) {
//       const { path, method, handler } = app.routes[i];
//       console.log(pathname,path,requestMethod,method)
//       if (pathname === path && requestMethod === method) {
//         return handler(req, res);
//       }
//     }
//     res.end(`Cannot ${requestMethod.toUpperCase()} ${pathname}`);
//   }

//   app.routes = [];

//   app.get = function(path, handler) {
//     const layer = {
//       path,
//       method: 'get',
//       handler,
//     }
//     app.routes.push(layer)
//   }

//   app.listen = function(port, handler) {
//     const server = http.createServer(app);
//     server.listen(port, handler);
//   }

//   return app;
// }

// module.exports = application;