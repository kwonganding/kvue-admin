
/* 这，只是一个crud的模板而已，方便快速CV操作 */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData, deleteByIds } = require('../db/db.js');
const ResponseData = require('../utils/response.js')

const MODULE_NAME = '菜单权限' // 下面用于构造友好的提示信息
const TABLE_NAME = 'table'    // 数据库表明

/**
 * 分页查询列表数据
 * 查询参数在query
 */
router.get('/user/list', (req, res) => {
  let totalSql = `SELECT count(id) as total FROM ${TABLE_NAME} WHERE 1=1 `
  let listSql = `SELECT id,name,state,remark,create_time as createTime ,last_time as lastTime 
    FROM ${TABLE_NAME}  WHERE 1=1 `
  let params = [];
  let where = ' '
  const query = req.query
  // 处理where条件
  if (query.name) {
    where += " and (name like ?)";
    params.push("%" + query.name + "%");
  }
  // 继续组装sql
  listSql += where
  totalSql += where
  // 执行查询
  queryPageData(listSql, totalSql, params, query)
    .then(data => {
      res.send(new ResponseData(data))
    })
    .catch(err => {
      console.error(err)
      res.send(new ResponseData().setError(err))
    })
})

/**
 * 获取单个详情
 */
router.get('/user/:id', (req, res) => {
  const sql = `SELECT id,name,state,remark,create_time as createTime ,last_time as lastTime 
    FROM ${TABLE_NAME} WHERE id = ? `
  const params = [req.params.id];
  queryData(sql, params)
    .then(rows => {
      res.send(new ResponseData(rows?.[0]))
    })
    .catch(err => {
      res.send(new ResponseData().setError(err))
    })
})

/**
 * 保存信息（新增+修改），基于主键id判断
 */
router.post('/user', async (req, res) => {
  const data = req.body
  const keyId = data.id  // 主键id
  const params = [data.name, data.state, data.remark]
  let resData = null
  // 修改-update
  if (keyId)
    resData = await update(res, keyId, params).catch((err) => { error = err; console.error(err) })
  // 新增-INSERT
  else
    resData = await insert(res, params).catch((err) => { error = err; console.error(err) })
  // 出错退出，没有回滚。。。
  if (resData.code != 0) {
    res.send(resData)
    return
  }
  res.send(new ResponseData(`${MODULE_NAME}[${keyId}]保存成功！`))
})
async function update(res, keyId, params) {
  const sql = `UPDATE ${TABLE_NAME}
    SET name = ?,state = ?, remark = ?,
        last_time = ${Date.now()}
    WHERE id = ? `
  params.push(keyId)
  return executeSql(sql, params).catch(err => {
    // 发生异常中止
    res.send(new ResponseData().setError(`${MODULE_NAME}[${keyId}]保存（UPDATE）发生异常：${err}`))
    Promise.resolve(err)
  })
}
async function insert(res, params) {
  const sql = `INSERT INTO ${TABLE_NAME}
    (name,state,remark,create_time,last_time)
    values(?,?,?,${Date.now()},${Date.now()}) `
  return executeSql(sql, params).catch(err => {
    // 发生异常中止
    res.send(new ResponseData().setError(`${MODULE_NAME}[${keyId}]保存（INSERT）发生异常：${err}`))
    Promise.resolve(err)
  })
}

/**
 * 删除指定id的数据，支持单个、多个（多个id逗号隔开）
 */
router.delete('/user/:id', (req, res) => {
  deleteByIds(res, TABLE_NAME, req.params.id, MODULE_NAME)
})


module.exports = router