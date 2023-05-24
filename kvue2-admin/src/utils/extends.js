/** 对JS类型的一些扩展方法 */

/**
 * 删除集合中指定条件的数据
 * @param {function} filter 过滤函数
 */
Array.prototype.remove = function(filter) {
  const arr = this
  const items = arr.filter(filter)
  for (let item of items) {
    const index = arr.indexOf(item)
    if (index >= 0)
      arr.splice(index, 1)
  }
}

/**返回集合的最后一个元素 */
Array.prototype.last = function() {
  return this[this.length - 1]
}
