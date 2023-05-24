/** 枚举创建工厂 */

// 使用示例1：const bookStatus = new EnumFactory({ normal: { text: '正常', type: 'success' }, disable: { text: '下架', type: 'warning' } }),
// 使用示例2：{ left: '左对齐', center: '居中', right: '右对齐' }
// 使用场景：
// 1、element中表格绑定，用tableFormater格式化显示文本
// 2、<el-tag>中使用，用text、type显示文本和状态
// 3、表格中可能也会用到<el-tag>
// 4、表单下拉框，或单选按钮组，绑定key、text

/**
 * 枚举创建工厂（构造函数），扩展枚举对象：keys、texts、values、entries、types、tableFormater
 * @param {object} enumObj 
 */
export default function EnumFactory(enumObj) {
  //复制（继承）enumObj
  Object.assign(this, enumObj)

  // keys：枚举的key集合[key]
  Object.defineProperty(this, 'keys', {
    value: Object.keys(enumObj)
  })
  //处理texts、values、entries    
  let values = [], texts = [], types = [], entries = []
  const vobjs = Object.values(enumObj)
  if (typeof vobjs[0] === 'string') {
    texts = vobjs
    vobjs.forEach((item, index) => {
      entries.push({ key: this.keys[index], text: texts[index] })
    })
  }
  else {
    vobjs.forEach((item, index) => {
      texts.push(item.text)
      values.push(item.value)
      types.push(item.type)
      entries.push({ key: this.keys[index], text: item.text, value: item.value, type: item.type })
    })
  }

  // texts：枚举的文本text集合[text]
  Object.defineProperty(this, 'texts', { value: texts })

  // values：枚举的数值value集合[value]
  Object.defineProperty(this, 'values', { value: values })

  // entries：枚举的key、text、value集合[{key,text,value}]
  Object.defineProperty(this, 'entries', { value: entries })

  // tableFormater：element中表格绑定枚举数据文本的formatter函数
  //r、c为行列，可传入null
  Object.defineProperty(this, 'tableFormater', {
    value: function(r, c, value) {
      return entries.filter(v => v.key === value || v.value === value)[0]?.text || 'notfound'
    }
  })

  //枚举定义的数据都是常量，不可修改，冻结一下
  Object.freeze(this)
}
