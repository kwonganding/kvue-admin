/** 枚举创建工厂 */

// 使用示例1：const bookStatus = new EnumFactory({ normal: { text: '正常', type: 'success' }, disable: { text: '下架', type: 'warning' } }),
// 使用示例2：{ left: '左对齐', center: '居中', right: '右对齐' }
// type 为elementui中的状态type	类型	string	success/info/warning/danger
// 使用场景：
// 1、element中表格绑定，用formatter格式化显示文本
// 2、<el-tag>中使用，用text、type显示文本和状态
// 3、表格中可能也会用到<el-tag>
// 4、表单下拉框，或单选按钮组，绑定key、text

/**
 * 枚举创建工厂（构造函数），扩展枚举对象：keys、texts、entries(key、text)、types、tableFormater
 * @param {object} enumObj
 */
export default function EnumFactory(enumObj, keyParseFunc = null) {
  //复制（继承）enumObj
  Object.assign(this, enumObj)

  // keys：枚举的key集合[key]
  Object.defineProperty(this, 'keys', {
    value: Object.keys(enumObj)
  })
  //处理texts、entries
  let texts = [], types = [], entries = []
  const vobjs = Object.values(enumObj)
  if (typeof vobjs[0] === 'string') {
    texts = vobjs
    vobjs.forEach((item, index) => {
      const key = keyParseFunc ? keyParseFunc(this.keys[index]) : this.keys[index]
      const obj = { key, text: texts[index] }
      entries.push(obj)
      this[this.keys[index]] = obj
    })
  }
  else {
    vobjs.forEach((item, index) => {
      texts.push(item.text)
      types.push(item.type)
      item.key = this.keys[index]
      entries.push(item)
    })
  }

  // texts：枚举的文本text集合[text]
  Object.defineProperty(this, 'texts', { value: texts })

  // entries：枚举的key、text集合[{key,text}]
  Object.defineProperty(this, 'entries', { value: entries })

  // formatter：element中表格绑定枚举数据文本的formatter函数
  //r、c为行列，可传入null
  Object.defineProperty(this, 'formatter', {
    value: function(r, c, value) {
      return entries.filter(v => v.key == value || v.text == value)[0]?.text || 'notfound'
    }
  })

  //枚举定义的数据都是常量，不可修改，冻结一下
  Object.freeze(this)
}
