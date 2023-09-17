
const { came2line, line2came } = require('./util')

/**
 * sql构造辅助函数，基于预定义的Table结构
 */
class SqlHelper {
  /**
   * 构造select字段的sql：select *** from table
   */
  select(table) {
    const select = this.selectColumns(table)
    return `SELECT ${select} FROM ${table.name}`
  }
  /**
   * 仅构造select字段的sql，并且设定as别名
   */
  selectColumns(table, as) {
    let select = table.fields.filter(f => f.select)
      .map(f => {
        return f.column == f.cameName ? f.column : `${f.column} as ${f.cameName}`
      })
    if (as)
      select = select.map(n => as + '.' + n)
    return select.join(',')
  }

  /**
   * 构造单个字段的where条件+参数处理
   */
  #where(field, data, params) {
    const value = data[field.cameName]
    if (value === undefined || value === null || value === '')
      return ''

    switch (field.operator) {
      case '=':
      case '>':
      case '<':
        params.push(value)
        return ` and ${field.column} ${field.operator} ?`
      case '%':
        params.push("%" + value + "%")
        return ` and ${field.column} like ?`
      case 'in': // 值为数组
      case 'not in':
        params.push(...value)
        return ` and ${field.column} ${field.operator} (${value.map(v => '?').join(',')})`
      case '<>': // 区间-两个值的数组
        params.push(value[0]);
        params.push(value[1]);
        return ` and ${field.column} >= ? and ${field.column} <= ? `
    }
  }
  /**
   * 构造的where条件+参数处理
   */
  where(table, data, params) {
    let sql = ' '
    table.fields.forEach(f => {
      if (!f.where) return
      sql += this.#where(f, data, params)
    })
    return sql
  }

  /**
   * 统计总数total的sql
   */
  total(table) {
    return `SELECT count(id) as total FROM ${table.name}`
  }

  /**
   * 排序的sql
   */
  orderBy(data) {
    if (data.orderBy) {
      return ` ORDER BY ${came2line(data.orderBy)} ${data.sortOrder ?? 'ASC'}`
    }
    return ''
  }
  /**
   * 分页sql
   */
  page(data, params) {
    if (data.pageIndex && data.pageSize) {
      params.push((data.pageIndex - 1) * data.pageSize, data.pageSize)
      return " LIMIT ?,?";
    }
    return ''
  }

  /**
   * update更新sql：update table set name=?,name2=?
   */
  update(table, data, params) {
    let names = []
    table.fields.forEach(f => {
      if (f.pk) return
      if (!f.update) return
      if (f.customValue) {
        names.push(f.column)
        params.push(f.customValue())
        return
      }
      let value = data[f.cameName]
      if (value == undefined || value == null) return
      if (f.converter)
        value = f.converter(value)
      names.push(f.column)
      params.push(value)
    })
    params.push(data.id)
    return `UPDATE ${table.name} SET ${names.map((n) => ` ${n} = ?`).join(',')} WHERE id = ? `
  }

  /**
   * insert sql：insert table (name) values(?)
   */
  insert(table, data, params) {
    let names = []
    table.fields.forEach(f => {
      if (f.pk) return
      if (f.customValue) {
        names.push(f.column)
        params.push(f.customValue())
        return
      }
      const value = data[f.cameName]
      if (value == undefined || value == null) return
      if (f.converter)
        value = f.converter(value)
      names.push(f.column)
      params.push(value)
    })
    return `INSERT INTO ${table.name} (${names.join(',')}) VALUES (${names.map(() => '?').join(',')})`
  }
}

module.exports = new SqlHelper()