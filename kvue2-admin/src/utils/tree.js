// tree树形结构数据处理

/**
 * 集合数据转换为树形结构。option.parent支持函数，示例：(n) => n.meta.parentName
 * @param {Array} list 集合数据
 * @param {Object} option 对象键配置，默认值{ key: 'id', parent: 'pid', children: 'children' }
 * @returns 树形结构数据tree
 */
export function list2Tree(list, option = { key: 'id', parent: 'pid', children: 'children' }) {
  let tree = []
  // 获取父编码统一为函数
  let pvalue = typeof (option.parent) === 'function' ? option.parent : (n) => n[option.parent]
  // map存放所有对象
  let map = {}
  list.forEach(item => {
    map[item[option.key]] = item
  })
  //遍历设置根节点、父级节点
  list.forEach(item => {
    if (!pvalue(item))
      tree.push(item)
    else {
      map[pvalue(item)][option.children] ??= []
      map[pvalue(item)][option.children].push(item)
    }
  })
  return tree
}

/**
 * 树形转平铺list（广度优先，先横向再纵向）
 * @param {*} tree 一颗大树
 * @param {*} option 对象键配置，默认值{ children: 'children' }
 * @returns 平铺的列表
 */
export function tree2List(tree, option = { children: 'children' }) {
  const list = []
  const queue = [...tree]
  while (queue.length) {
    const item = queue.shift()
    if (item[option.children]?.length > 0)
      queue.push(...item[option.children])
    list.push(item)
  }
  return list
}

/**
 * 递归设置树形结构中数据的 disabled 属性值为不可用。使用场景：在修改父级时，不可选择自己及后代
 * @param {*} tree 一颗大树
 * @param {*} disabledNode 需要禁用的节点，就是当前节点
 * @param {*} option 对象键配置，默认值{ children: 'children', disabled: 'disabled' }
 * @returns void
 */
export function setTreeDisable(tree, disabledNode, option = { children: 'children', disabled: 'disabled' }) {
  if (!tree || tree.length <= 0)
    return tree
  // 递归更新disabled值
  const update = function(tree, value) {
    if (!tree || tree.length <= 0)
      return
    tree.forEach(item => {
      item[option.disabled] = value
      update(item[option.children], value)
    })
  }
  // 开始干活，先重置
  update(tree, false)
  if (!disabledNode) return tree
  // 设置所有子节点disable = true
  disabledNode[option.disabled] = true
  update(disabledNode[option.children], true)
  return tree
}

/**
 * 递归搜索树，返回新的树形结构数据，只要子节点命中保留其所有上级节点
 * @param {Array|Tree} tree 一颗大树
 * @param {Function} func 过滤函数，参数为节点对象
 * @param {Object} option 对象键配置，默认值{ children: 'children' }
 * @returns 过滤后的新 newTree
 */
export function filterTree(tree, func, option = { children: 'children' }) {
  let resTree = []
  if (!tree || tree?.length <= 0) return null
  tree.forEach(node => {
    if (func(node)) {
      // 当前节点命中
      const newNode = { ...node }
      if (node[option.children])
        newNode[option.children] = null //清空子节点，后面递归查询赋值
      const cnodes = filterTree(node[option.children], func, option)
      if (cnodes && cnodes.length > 0)
        newNode[option.children] = cnodes
      resTree.push(newNode)
    }
    else {
      // 如果子节点有命中，则包含当前节点
      const fnode = filterTree(node[option.children], func, option)
      if (fnode && fnode.length > 0) {
        const newNode = { ...node, [option.children]: null }
        newNode[option.children] = fnode
        resTree.push(newNode)
      }
    }
  })
  return resTree
}

//callback(node)

/**
 * 类似Array.prototype.map()，对树进行递归map，返回依然是一个数组
 * @param {Array} tree 树形结构数据
 * @param {Function} callback callback(node)每个节点递归执行的函数，callback返回值组合为数组返回
 * @param {Object} option 对象键配置，默认值{ children: 'children' }
 * @returns
 */
export function map(tree, callback, option = { children: 'children' }) {
  const result = []
  if (!tree || tree?.length <= 0) return null
  tree.forEach(node => {
    if (!node) return null
    result.push(callback(node))
    if (node[option.children] && node[option.children].length > 0) {
      const res = map(node[option.children], callback, option)
      if (res) result.push(...res)
    }
  })
  return result
}


