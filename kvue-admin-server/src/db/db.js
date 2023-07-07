//加载sqlite并创建数据库实例

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./src/db/book_db.db');

const ResponseData = require('../utils/response');

//?sqlite参数化，用问号"?"占位，参数值用数组组装。
//执行sql： db.run(sql,para,callback)
//查询数据： db.all(sql,para,callback)

db.printError = function(error) {
  if (error)
    console.error(error);
}

//查询数据
db.queryData = function(sql, params, callback) {
  if (!params) params = {};
  db.all(sql, params, function(error, rows) {
    db.printError(error);
    let resData = new ResponseData(0, error);
    callback(resData, rows);
  })
}

//执行sql：增、删、修改
db.executeSql = function(sql, params, callback) {
  db.run(sql, params, function(error) {
    db.printError(error);
    let resData = new ResponseData(0, error);
    callback(resData);
  })
}

module.exports = db;

