
/* 这，只是一个crud的模板而已，方便快速CV操作 */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData, deleteByIds } = require('../db/db.js');
const ResponseData = require('../utils/response.js')

const MODULE_NAME = '角色'        // 下面用于构造友好的提示信息
const TABLE_NAME = 'sys_role'    // 数据库表明

/**
 * 分页查询列表数据
 * 查询参数在query
 */
router.get('/role/list', (req, res) => {
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
  if (query.state) {
    where += " and state = ?";
    params.push(query.state);
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
 * 获取单个详情，包括角色的授权资源id集合
 */
router.get('/role/:id', async (req, res) => {
  const sql = `SELECT id,name,state,remark,create_time as createTime ,last_time as lastTime 
    FROM ${TABLE_NAME} WHERE id = ? `
  const params = [req.params.id];
  let error = null
  // 1、获取基本信息
  const rrows = await queryData(sql, params).catch(err => error = err)
  const data = rrows?.[0]
  // 2、获取资源授权信息
  if (data) {
    const prows = await queryData(`SELECT GROUP_CONCAT(per_id) as ids FROM sys_role_permission WHERE role_id = ?`, params)
      .catch(err => error = err)
    data.permissionIds = prows?.[0]?.ids?.split(',').split(',').map(s=>parseInt(s))
  }
  // 返回
  if (error)
    res.send(new ResponseData().setError(error))
  else
    res.send(new ResponseData(data))
})

/**
 * 保存信息（新增+修改），基于主键id判断
 */
router.post('/role', async (req, res) => {
  const data = req.body
  let keyId = data.id  // 主键id
  const params = [data.name, data.state, data.remark]
  let resData = null
  // 修改-update
  if (keyId)
    resData = await update(res, keyId, params).catch((err) => { error = err; console.error(err) })
  // 新增-INSERT
  else {
    resData = await insert(res, params).catch((err) => { error = err; console.error(err) })
    keyId = resData.data
  }
  // 出错退出，没有回滚。。。
  if (resData.code != 0) {
    res.send(resData)
    return
  }
  saveRolePermission(keyId, data.permissionIds)
    .then(() => {
      res.send(new ResponseData(keyId,`${MODULE_NAME}[${keyId ?? ''}]保存成功！`))
    })
    .catch(err => {
      res.send(new ResponseData().setError(`${MODULE_NAME}[${keyId ?? ''}]（权限资源）保存发生异常：${err}`))
    })
})
async function update(res, keyId, params) {
  const sql = `UPDATE ${TABLE_NAME}
    SET name = ?,state = ?, remark = ?,
        last_time = ${Date.now()}
    WHERE id = ? `
  params.push(keyId)
  return executeSql(sql, params).catch(err => {
    // 发生异常中止
    return new ResponseData().setError(`${MODULE_NAME}[${keyId}]保存（UPDATE）发生异常：${err}`)
  })
}
async function insert(res, params) {
  const sql = `INSERT INTO ${TABLE_NAME}
    (name,state,remark,create_time,last_time)
    values(?,?,?,${Date.now()},${Date.now()}) `
    return executeSql(sql, params).catch(err => {
    // 发生异常中止
    return new ResponseData().setError(`${MODULE_NAME}保存（INSERT）发生异常：${err}`)
  })
}
// 保存角色授权信息
async function saveRolePermission(roleId, permissionIds) {
  permissionIds ??= []
  // 查出已有授权集合
  let rsql = `SELECT GROUP_CONCAT(per_id) as ids FROM sys_role_permission WHERE role_id = ?`
  const oldRows = await queryData(rsql, [roleId])
  const oldPermissions = oldRows?.[0]?.ids
  // 如果相同则不处理
  if (permissionIds.join(',') == oldPermissions)
    return
  // 计算出删除的，新增的角色，分别进行删除、插入操作。
  const arrOld = oldPermissions?.split(',') ?? []
  const arrNew = permissionIds
  const arrDelete = arrOld.filter(c => !arrNew.includes(c))
  const arrInsert = arrNew.filter(c => !arrOld.includes(c))

  // delete
  if (arrDelete.length > 0) {
    const dsql = `DELETE FROM sys_role_permission WHERE role_id = ? and per_id in (${arrDelete.join(',')})`
    await executeSql(dsql, [roleId])
  }
  // insert
  if (arrInsert.length > 0) {
    const params = []
    let isql = 'INSERT INTO sys_role_permission(role_id,per_id) VALUES '
      + arrInsert.map(pid => '(?,?)').join(',')
    arrInsert.map(pid => { params.push(roleId, pid) })
    await executeSql(isql, params)
  }
}

/**
 * 删除指定id的数据，支持单个、多个（多个id逗号隔开）
 */
router.delete('/role/:id', (req, res) => {
  deleteByIds(res, TABLE_NAME, req.params.id, MODULE_NAME)
})


module.exports = router