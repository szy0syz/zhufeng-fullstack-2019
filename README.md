# zhufeng-fullstack-2019

## 10.Express

### express_v1

* 当我们 `require('express')` 代码时，其实加载到的是一个函数；
* 这个express函数执行又会返回一个 `有属性的函数`
* 然后在这个对象有限有两个属性 get 和 listen，且都返回函数
  * get函数的参数是path和handler
  * listen函数的参数是port和handler
* v1源码内部先有一个app函数，用来在listen时，监听用户请求，根据请求路径和请求方法分别取routes数组里找对应的监听函数handler

### express_v2

升级v2版，我们需要解决如下问题：

* 标准的http请求那么多，我们如果分别挂载到属性上呢？
* 需要一个all属性的中间件表示匹配所有类型的http方法，且还需要支持路由 `*` 表示匹配所有路由

实现原理：

* 源码里tj写了一个methods的包，支持一个数组，含标准http的所有method
* all也同时挂载到属性上，且 * 匹配所有路由

### express_v3

支持动态路由，抓取key/value

实现思路：

* 首先在挂载时，先查看是否动态路由，只需要查看是否path包含 `:`