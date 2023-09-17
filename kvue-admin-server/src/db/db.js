/** sqlite数据库操作服务类 */


let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./src/db/kdb.db');
const sqlHelper = require('../utils/sql-helper.js')

//?sqlite参数化，用问号"?"占位，参数值用数组组装。
//执行sql： db.run(sql,para,callback)
//查询数据： db.all(sql,para,callback)

function begin() {
  db.run('BEGIN TRANSACTION')
}
function back() {
  db.run('ROLLBACK')
}
function end() {
  db.run('COMMIT')
}

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
      reject(err)
    }
  })
}

/**
 * 查询分页数据（处理分页、排序）
 * @param {String} listSql 列表查询sql
 * @param {String} totalSql 查询总数的sql
 * @param {Array} params sql参数值数组
 * @returns 返回Promise({total,list})
 */
async function queryPageData(listSql, totalSql, params, query) {
  const data = {}
  // 1、获取总数
  const trows = await queryData(totalSql, params)
  data.total = trows?.[0]?.total
  // 2、查询列表数据  
  // 排序、分页
  listSql += sqlHelper.orderBy(query) + sqlHelper.page(query, params)
  data.list = await queryData(listSql, params)
  return data
}

/**
 * 执行sql：增、删、修改
 * @param {String} sql sql语句
 * @param {Array} params 参数值数组
 * @returns 返回Promise，值为受影响的行id（新增、修改）
 */
function executeSql(sql, params) {
  return new Promise((resolve, reject) => {
    try {
      db.run(sql, params, function(error) {
        // this: { lastID: 0, changes: 0 }
        if (error) {
          reject(handleError(error))
        }
        if (this.changes > 0)
          resolve(this.lastID)
        else
          reject('生效行数为0')
      })
    }
    catch (err) {
      reject(err)
    }
  })
}

const SQL_ERRORS = [
  { error: 'Error: SQLITE_CONSTRAINT: NOT NULL constraint failed', text: '字段值不可为空' },
  { error: 'Error: SQLITE_CONSTRAINT: UNIQUE constraint failed', text: '字段值已存在' },
]

function handleError(error) {
  const etext = error.toString()
  const ne = SQL_ERRORS.filter(e => etext.startsWith(e.error))?.[0]
  if (ne) {
    return (etext.match(/[^.]+$/)[0] || "") + ne.text
  }
  return etext
}

// Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: sys_dict.type
// Error: SQLITE_CONSTRAINT: UNIQUE constraint failed

/** 判断执行结果是否有效：影响行数、id
 * https://github.com/TryGhost/node-sqlite3/wiki/API#runparam---callback
 * If execution was successful, the this object will contain two properties named lastID and changes 
 * which contain the value of the last inserted row ID and the number of rows affected by this query respectively.
 */

module.exports = { db, queryPageData, executeSql, queryData };

