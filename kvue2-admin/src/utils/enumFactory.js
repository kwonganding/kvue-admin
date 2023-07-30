/** 枚举创建工厂 */

// 使用示例1（标准模式）：new EnumFactory({ normal: { text: '正常', type: 'success' }, disable: { text: '下架', type: 'warning' } }),
// 使用示例1（数字key，需提供转换函数）：new EnumFactory({ 1: { text: '男', type: 'priary' }, 2: { text: '女', type: 'warning' }, 9: { text: '其他', type: 'info' } },parseInt),
// 使用示例3(简单模式)：{ left: '左对齐', center: '居中', right: '右对齐' }
// type 为elementui中的状态type	类型	string	success/info/warning/danger
// 使用场景：
// 1、elementUI中表格绑定，用formatter格式化显示文本：<el-table-column :formatter="enumObj.formatter" >
// 2、<el-tag>中使用，用text、type显示文本和状态：<el-tag :type="enumObj[value]?.type">{{ enumObj[value]?.text }}</el-tag>
// 3、表单下拉框，或单选按钮组，绑定key、text：<el-select v-model="value"> <el-option v-for="e in enumObj.values" :key="e.key" :value="e.key" :label="e.text"></el-option> </el-select>


/**
 * 枚举创建工厂（构造函数），扩展枚举对象：keys、values(含key值的[{key,text,type}])、formatter。
 * @param {*} enumObj 枚举值，支持标准模式{key:{text,type},}，简单模式{key:text,}（会自动转换为标准模式）
 * @param {*} keyParseFunc key的转换函数，默认null，如果key为整数则传 parseInt
 */
export default function EnumFactory(enumObj, keyParseFunc = null) {
  //复制（继承）enumObj
  Object.assign(this, enumObj)

  // keys：枚举的key集合[key]
  Object.defineProperty(this, 'keys', {
    value: keyParseFunc ? Object.keys(enumObj).map(s => keyParseFunc(s)) : Object.keys(enumObj)
  })

  // 处理 values
  let values = []
  const ovalues = Object.values(enumObj)
  // 主要区分下value是简单类型（字符串）还是对象类型
  if (typeof ovalues[0] === 'string') {
    ovalues.forEach((text, index) => {
      const obj = { key: this.keys[index], text }
      values.push(obj)
      this[this.keys[index]] = obj
    })
  }
  else {
    ovalues.forEach((item, index) => {
      item.key = this.keys[index]
      values.push(item)
    })
  }
  // 设置values属性
  Object.defineProperty(this, 'values', { value: values })

  // formatter：elementUI中表格绑定枚举数据文本的formatter函数
  // r、c为行列，可传入null
  Object.defineProperty(this, 'formatter', {
    value: function(r, c, value) {
      return values.filter(v => v.key == value || v.text == value)[0]?.text || 'notfound'
    }
  })

  //枚举定义的数据都是常量，不可修改，冻结一下
  Object.freeze(this)
}
