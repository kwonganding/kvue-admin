/** sqlite数据库操作服务类 */

const ResponseData = require('../utils/response');

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./src/db/kdb.db');

//?sqlite参数化，用问号"?"占位，参数值用数组组装。
//执行sql： db.run(sql,para,callback)
//查询数据： db.all(sql,para,callback)

/**
 * 执行查询SQL语句，返回结果数据
 * @param {String} sql sql语句
 * @param {Array} params sql参数值数组
 * @returns 返回Promise(rows)
 */
function queryData(sql, params) {
  return new Promise((resolve, reject) => {
    try {
      db.all(sql, params, function(error, rows) {
        if (error) {
          reject(error)
        }
        else resolve(rows)
      })
    }
    catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

/**
 * 查询分页数据（处理分页、排序）
 * @param {String} sql 查询分页数据的sql
 * @param {String} totalSql 查询总数的sql
 * @param {Array} params sql参数值数组
 * @param {Object} query 请求rul的query
 * @returns 返回Promise({total,list})
 */
async function queryPageData(listSql, totalSql, params, query) {
  const data = {}
  // 1、获取总数
  const trows = await queryData(totalSql, params)
  data.total = trows?.[0]?.total
  // 2、查询列表数据
  // 排序字段，默认id排序
  if (query.orderBy) {
    listSql += ` ORDER BY ${query.orderBy} ${query.sortOrder ?? 'ASC'}`
  }
  //查询数据，分页
  if (query.pageIndex && query.pageSize) {
    listSql += " LIMIT ?,?";
    params.push((query.pageIndex - 1) * query.pageSize, query.pageSize)
  }
  data.list = await queryData(listSql, params)
  return data
}

/**
 * 执行sql：增、删、修改
 * @param {String} sql sql语句
 * @param {Array} params 参数值数组
 * @returns 返回Promise
 */
function executeSql(sql, params) {
  return new Promise((resolve, reject) => {
    try {
      db.run(sql, params, function(error) {
        if (error) {
          reject(error)
        }
        else resolve(new ResponseData())
      })
    }
    catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

/************************** 下面为通用数据表操作封装 *********************************/

/**
 * 根据主键id删除表格中的数据
 * @param {String} table 数据表名称
 * @param {String} ids id集合字符串，多个逗号隔开
 */
function deleteByIds(res, table, ids, moduleName) {
  // 参数化
  if (!ids) {
    res.send(new ResponseData().setError(moduleName + '删除失败，参数为空'))
    return
  }
  const arr = ids.split(',')
  const sql = `DELETE FROM ${table} WHERE id in (${arr.map(a => '?').join(',')})`
  executeSql(sql, arr)
    .then(() => {
      res.send(new ResponseData(null, `${moduleName}删除成功：${ids}`))
    })
    .catch(err => {
      console.error(err)
      res.send(new ResponseData().setError(err))
    })
}

module.exports = { db, queryPageData, executeSql, queryData, deleteByIds };

