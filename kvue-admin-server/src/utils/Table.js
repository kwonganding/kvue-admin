const { came2line, line2came } = require('./util')

/**
 * 字段定义，用于配置表的字段，然后在sqlheler中用来生成sql
 * @param {string} column 数据库库字段名称
 * @param {string} operator where比较时的操作符：“=”相对、“%”模糊、in、“<>”为区间比较
 * @param {boolean} pk 是否主键，默认false
 * @param {boolean} select 是否生成select查询语句
 * @param {boolean} where 是否生成where语句
 * @param {boolean} update 是否生成update语句
 * @param {Function} converter 值转换器，对前端传入的值进行转换：bool converter(value)
 * @param {Function} customValue 自定义值方法，insert、update时获取值，value customValue()
 */
function Field(column, operator = '=', pk = false, select = true, where = true, update = true, converter = null, customValue = undefined) {
  this.column = column
  // 字段的驼峰命名，用于和前端通信
  this.cameName = line2came(column)
  this.operator = operator
  this.pk = pk
  this.select = select
  this.where = where
  this.update = update
  this.converter = converter
  this.customValue = customValue

  /**
   * 按需配置库表字段属性，返回字段本身
   * @param {*} param0 { pk, select, where, update, converter, customValue }结构，按需设置
   */
  this.set = function({ pk, select, where, update, converter, customValue }) {
    if (pk !== undefined) this.pk = pk
    if (select !== undefined) this.select = select
    if (where !== undefined) this.where = where
    if (update !== undefined) this.update = update
    if (converter !== undefined) this.converter = converter
    if (customValue !== undefined) this.customValue = customValue
    return this
  }
}

/**
 * 表结构定义
 */
class Table {
  // 库表名称，如“sys_user”
  name = undefined
  // 对象编码名称，如“user”
  code = undefined
  // 中文描述，如“用户信息”
  title = undefined
  // 字段集合
  fields = []
  constructor(name, code, title) {
    this.name = name
    this.code = code
    this.title = title
  }
  /**
   * 添加字段，返回字段对象，便于链式操作
 * @param {string} column 数据库库字段名称
 * @param {string} operator where比较时的操作符：“=”相对、“%”模糊、in、“<>”为区间比较
   * @returns 返回字段对象，便于链式操作
   */
  add(column, operator = '=') {
    const f = new Field(column, operator)
    this.fields.push(f)
    return f
  }
}

module.exports = Table