
let real = '/user/44/jerry'
let str = '/user/:id/:name'

let args = []
// 全局所有小分组 以:开头但且不带 / 的字符串
str = str.replace(/:([^\/]*)/g, function() {
  args.push(arguments[1]);
  return '([^\/]*)'
})
let reg = new RegExp(str)

// 此时返回的对象是这样一个
/*
[ '/user/44/jerry',
  '44',
  'jerry',
  index: 0,
  input: '/user/44/jerry',
  groups: undefined ]
*/
// 我们已数组结构 只会结构前三项 /user/44/jerry, 44, jerry 而且我们还不要第一项
let [ , ...lists] = real.match(reg) // 不要第一项的迭代

// 这里就是把 args: {'id', 'name'} 换成一个带value的对象数组
let result = args.reduce((memo, arg, index) => (memo[arg] = lists[index], memo), {});
console.log(result)