// 登录授权

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData, deleteByIds } = require('../db/db.js');
const gm = require('../utils/gm.js')
const ResponseData = require('../utils/response.js')

const MODULE_NAME = '用户信息' // 下面用于构造友好的提示信息
const TABLE_NAME = 'sys_user'    // 数据库表明

/**
 * 查询列表数据，
 * 查询参数query：用户名/昵称、部门（左树）、手机号、邮箱、注册时间段
 */
router.get('/user/list', (req, res) => {

  let totalSql = `select count(id) as total from ${TABLE_NAME} WHERE 1=1 `
  let listSql = `SELECT
    id,name,avatar,nickname,gender,phone,email,department_id as departmentId,remark,state,create_time as createTime ,last_time as lastTime
  FROM ${TABLE_NAME} WHERE 1=1 `
  let params = [];
  let where = ' '
  const query = req.query  // 标准查询结构
  // 处理where条件
  if (query.name) {
    where += " and (name like ? or id like ?)";
    params.push("%" + query.name + "%");
    params.push("%" + query.name + "%");
  }
  // 性别、部门、手机号、邮箱、创建时间段
  if (query.gender) {
    where += " and gender = ?";
    params.push(query.gender);
  }
  if (query.departmentId) {
    where += " and department_id = ?";
    params.push(query.departmentId);
  }
  if (query.phone) {
    where += " and phone like ?";
    params.push("%" + query.phone + "%");
  }
  if (query.state) {
    where += " and state = ?";
    params.push(query.state);
  }
  if (query.email) {
    where += " and phone like ?";
    params.push("%" + query.email + "%");
  }
  if (query.createTime && query.createTime?.length > 0) {
    where += " and create_time >= ?  and create_time <= ?";
    params.push(query.createTime[0]);
    params.push(query.createTime[1]);
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
      res.send(new ResponseData().setError(err))
    })
})

/**
 * 获取单个详情，用于编辑、展示
 * 需包含部门名称，角色组的id、名称
 */
router.get('/user/:id', (req, res) => {
  const sql = `SELECT
    u.id,u.name,u.avatar,u.nickname,u.gender,u.phone,u.email,u.department_id as departmentId,dep.name as departmentName,u.remark,u.state,u.create_time as createTime ,u.last_time as lastTime,
    GROUP_CONCAT(r.name) AS roleNames,GROUP_CONCAT(r.id) AS roleIds
  FROM
    ${TABLE_NAME} AS u
  LEFT JOIN
    sys_user_role AS ur ON u.id = ur.user_id
  LEFT JOIN
    sys_role AS r ON ur.role_id = r.id
  LEFT JOIN
    sys_department AS dep on u.department_id = dep.id
  WHERE u.id = ? `
  const params = [req.params.id];
  queryData(sql, params)
    .then(rows => {
      const resData = new ResponseData()
      if (rows && rows.length > 0) {
        resData.data = rows[0]
        // 角色值转换为数组
        resData.data.roleIds = resData.data.roleIds?.split(',').map(s=>parseInt(s))
        resData.data.roleNames = resData.data.roleNames?.split(',')
      }
      else
        resData.setError('用户不存在：' + req.params.id)
      res.send(resData)
    })
    .catch(err => {
      res.send(new ResponseData().setError(err))
    })
})

/**
 * 更新（新增+修改）后端基于id来判断，包含角色关联信息
 * 修改时：密码不填写则不处理
 */
router.post('/user', async (req, res) => {
  const data = req.body
  let userId = data.id
  // 密码处理，修改时不设置密码则不会更新密码值
  let pwd = null
  if (data.pwd) {
    pwd = gm.sm2Decrypt(data.pwd)
    pwd = gm.sm3Hash(pwd)
  }
  let params = [data.name, data.nickname, pwd, data.avatar, data.gender, data.phone, data.email
    , data.departmentId, data.remark, data.state];
  let resData = null
  // 修改-update
  if (userId) {
    resData = await update(userId, params, pwd)
  }
  // 新增-insert 
  else {
    resData = await insert(params)
    userId = resData.data
  }
  // 出错退出，没有回滚。。。
  if (resData.code != 0) {
    res.send(resData)
    return
  }
  // 保存用户角色信息
  saveUserRoles(userId, data.roleIds)
    .then(() => {
      resData.message = '用户信息保存成功：' + userId
      resData.data = userId
    })
    .catch(err => {
      resData.setError('保存用户信息（角色）发生异常：' + err)
    })
    .finally(() => res.send(resData))
})

async function update(keyId, params, pwd) {
  let sql = `UPDATE ${TABLE_NAME}
    SET name = ?, nickname = ?, pwd = ?, avatar = ?, gender = ?, phone = ?, email = ?, department_id = ?, remark = ?, state = ?,
        last_time = ${Date.now()} 
    WHERE id = ? `
  params.push(keyId)
  // 如果没有设置密码，则去掉密码项，只针对修改模式（前端控制）
  if (!pwd) {
    params.splice(2, 1)
    sql = sql.replace('pwd = ?,', '')
  }
  return executeSql(sql, params).catch(err => {
    // 发生异常中止
    const resData = new ResponseData().setError(`${MODULE_NAME}[${keyId}]保存（UPDATE）发生异常：${err}`)
    Promise.resolve(resData)
  })
}
async function insert(params) {
  const sql = `INSERT INTO ${TABLE_NAME}
    (name,nickname,pwd,avatar,gender,phone,email,department_id,remark,state,create_time,last_time)
    values(?,?,?,?,?,?,?,?,?,?,${Date.now()},${Date.now()}) `
  return executeSql(sql, params)
    .catch(err => {
      // 发生异常中止
      let errs = err.toString()
      const resData = new ResponseData()
      if (errs.indexOf('UNIQUE constraint failed') >= 0)
        resData.setError('用户名已存在！')
      else
        resData.setError(`${MODULE_NAME}保存（INSERT）发生异常：${err}`)
      return resData
    })
}

// 保存用户角色：差异更新用户-角色关联表
async function saveUserRoles(userId, roleIds) {
  if (!userId) {
    return Promise.reject('saveUserRoles Error, userId is invalid:' + userId)
  }
  roleIds ??= []
  // 先获取原有角色
  let rsql = 'SELECT GROUP_CONCAT(role_id) as ids FROM sys_user_role WHERE user_id = ? ORDER BY role_id'
  const oldRows = await queryData(rsql, [userId])
  const oldRoleIds = oldRows?.[0]?.ids

  // 判断如果相同则不处理
  if (roleIds.join(',') == oldRoleIds) {
    return
  }
  // 计算出删除的，新增的角色，分别进行删除、插入操作。
  const arrOld = oldRoleIds?.split(',') ?? []
  const arrNew = roleIds
  const arrDelete = arrOld.filter(c => !arrNew.includes(c))
  const arrInsert = arrNew.filter(c => !arrOld.includes(c))

  // delete
  if (arrDelete.length > 0) {
    const dsql = `DELETE FROM sys_user_role WHERE user_id = ? and role_id in (${arrDelete.join(',')})`
    await executeSql(dsql, [userId])
  }
  // insert
  if (arrInsert.length > 0) {
    const params = []
    let isql = 'INSERT INTO sys_user_role(user_id,role_id) VALUES '
      + arrInsert.map(rid => '(?,?)').join(',')
    arrInsert.map(rid => { params.push(userId, rid) })
    await executeSql(isql, params)
  }
}

/**
 * 删除指定id的数据，支持单个、多个（多个id逗号隔开）
 */
router.delete('/user/:id', (req, res) => {
  console.log(req)
  deleteByIds(res, TABLE_NAME, req.params.id, MODULE_NAME)
})

// 个人中心：修改基本信息，只可修改部分个人私有信息
router.post('/user/profile', (req, res) => {
  const now = Date.now()
  const data = req.body
  let params = [data.avatar, data.nickname, data.gender, data.phone, data.email, data.remark, data.id];
  let sql = `UPDATE ${TABLE_NAME}
      SET avatar = ?, nickname = ?, gender = ?, phone = ?, email = ?, remark = ?,
          last_time = ${now}
      WHERE id = ? `
  // 执行SQL
  executeSql(sql, params)
    .then(() => {
      res.send(new ResponseData(null, '用户信息更新成功！'))
    })
    .catch(err => {
      res.send(new ResponseData().setError(err))
    })
})

// 个人中心：修改密码
router.post('/user/pwd', (req, res) => {
  const now = Date.now()
  // 密码处理
  let pwd = gm.sm2Decrypt(req.body.pwd)
  pwd = gm.sm3Hash(pwd)
  let npwd = gm.sm2Decrypt(req.body.npwd)
  npwd = gm.sm3Hash(npwd)
  //构造sql查询
  const sql = `UPDATE ${TABLE_NAME} SET pwd =?,last_time=${now} WHERE id =? and pwd =?`;
  const params = [npwd, req.body.id, pwd]

  // 执行SQL
  executeSql(sql, params)
    .then(() => {
      res.send(new ResponseData(null, '用户密码更新成功！'))
    })
    .catch(err => {
      res.send(new ResponseData().setError("更新失败，可能是旧密码错误。"+err))
    })
})

module.exports = router