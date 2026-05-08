/**
 * Node 20+ 移除了 util.isRegExp，部分 uni-app 依赖仍调用该方法。
 */
const util = require('util')

if (typeof util.isRegExp !== 'function') {
  util.isRegExp = function isRegExp(val) {
    return Object.prototype.toString.call(val) === '[object RegExp]'
  }
}
