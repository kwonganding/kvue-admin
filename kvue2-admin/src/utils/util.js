/** 全局通用工具方法 */
// delay：创建一个延迟执行一个函数
// delayCall：延迟执行一个函数
// debounce：创建一个防抖函数
// throttle：创建一个节流函数
// deepClone：深拷贝一个对象
// formatTime：解析日期，并格式化为字符串
// formatNow：解析日期，并格式化为当前时间的字符串描述，如“20分钟前”、“3小时前”等
// param2Obj：解析URL地址中的查询参数，转换为对象

/**
 * 创建一个延迟执行一个函数，示例：delay(func,1000)(args)
 * @param {function} func 函数
 * @param {number} ms 延迟毫秒
 * @returns 返回支持了延迟的函数
 */
export function delay(func, ms) {
  return function(...args) {
    setTimeout(() => {
      func.apply(this, args)
    }, ms)
  }
}

/**
 * 延迟执行一个函数，并返回一个Promise（包含函数返回值）。示例：delayCall(func,1000,args).then(res=>res)
 * @param {function} func 函数
 * @param {number} ms 延迟毫秒
 * @param  {...any} args 参数
 * @returns promise对象，包含函数返回值
 */
export function delayCall(func, ms, ...args) {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = func.call(this, ...args)
      resolve(result)
    }, ms)
  })
}

// bounce / baʊns / 晃动，弹跳
/**
 * 创建一个防抖函数，预防抖动，延迟 @delayTime 执行函数，直到 @delayTime 时间内没有再次调用才执行最后一次，前面的会被抛弃。
 * 调用：const dfunc = debounce(func,1000)
 * @param {function} func
 * @param {*} delayTime 毫秒
 * @returns 返回支持防抖的函数
 */
export function debounce(func, delayTime) {
  let timer
  return function(...args) {
    //清除-替换，把前浪拍死在沙滩上
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delayTime)
  }
}

//返回一个函数，由于闭包，状态falg将一直在内存中  //throttle /ˈθrɒtl/
/**
 * 创建一个节流函数，节约流量，间隔时间 @intervalTime 只执行一次，其余会被抛弃。执行每轮首次+整体最后一次。
 * 调用：const tfunc = throttle(func,1000)
 * @param {function} func 函数
 * @param {*} intervalTime 间隔时间
 * @returns 返回支持了节流的函数
 */
export function throttle(func, intervalTime = 100) {
  let startTime, timer = null
  //这里不能用箭头函数，会导致this污染
  return function(...args) {
    const ctx = this
    let now = Date.now()
    if (startTime && now < startTime + intervalTime) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
        startTime = now
      }, Math.max(intervalTime - (now - startTime), 0))
    }
    else {
      startTime = now
      func.apply(ctx, args)
    }
  }
}

/******************************   deepClone深拷贝对象  ******************************/

/**
 * 深拷贝一个对象，target为待拷贝的对象，hash用于内部缓存对象，不用传
 * @param {object} target  目标
 * @param {WeakMap} hash  内部递归缓存对象，不用传入
 * @returns 新对象
 */
export function deepClone(target, hash = new WeakMap()) {
  //值类型直接返回
  if (target === null || typeof target !== 'object')
    return target
  //对象属性值都放入map中,避免循环引用
  if (hash.get(target))
    return hash.get(target)
  // 兼容数组
  let newObj = Array.isArray(target) ? [] : {}
  //缓存到map中
  hash.set(target, newObj)
  for (let key in target) {
    //只处理自己的一级属性，过滤原型继承的
    if (!target.hasOwnProperty(key)) continue
    // 值类型直接赋值，引用类型递归
    if (target[key] === null || typeof target[key] !== 'object')
      newObj[key] = target[key]
    else
      newObj[key] = deepClone(target[key], hash)
  }
  return newObj
}

/** 解析URL地址中的查询参数，转换为对象
 * @param {string} url URL地址
 * @returns {Object} 返回对象
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

