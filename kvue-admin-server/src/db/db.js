/** sqlite数据库操作服务类 */

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./src/db/kdb.db');

const ResponseData = require('../utils/response');

//?sqlite参数化，用问号"?"占位，参数值用数组组装。
//执行sql： db.run(sql,para,callback)
//查询数据： db.all(sql,para,callback)

/**
 * 执行查询SQL语句，返回结果数据
 * @param {String} sql sql语句
 * @param {Array} params sql参数值数组
 * @returns 返回Promise(rows)
 */
function queryData(sql, params, callback) {
  return new Promise((resolve, reject) => {
    try {
      db.all(sql, params, function(error, rows) {
        if (error) reject(error)
        else resolve(rows)
      })
    }
    catch (err) {
      reject(err)
    }
  })
}

/**
 * 查询分页数据
 * @param {String} sql 查询分页数据的sql
 * @param {String} totalSql 查询总数的sql
 * @param {Array} params sql参数值数组
 * @param {Object} query 请求rul的query
 * @returns 返回Promise({total,list})
 */
async function queryPageData(sql, totalSql, params, query) {
  const data = {}
  // 获取总数
  const trows = await queryData(totalSql, params)
  data.total = trows?.[0]?.total
  //查询数据，分页
  sql += " limit ?,?";
  params.push((query.pageIndex - 1) * query.pageSize, query.pageSize)
  data.list = await queryData(sql, params)
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
        if (error) reject(error)
        else resolve()
      })
    }
    catch (err) {
      reject(err)
    }
  })
}

module.exports = { db, queryPageData, executeSql, queryData };

