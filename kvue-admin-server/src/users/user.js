// 登录授权

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData } = require('../db/db.js');
const gm = require('../utils/gm.js')
const ResponseData = require('../utils/response.js')

// 查询列表数据，查询参数：用户名/昵称、部门（左树）、手机号、邮箱、注册时间段
router.get('/user/list', (req, res) => {
  let totalSql = 'select count(id) as total from user_info WHERE 1=1 '
  let sql = `
  SELECT
    id,name,avatar,nickname,gender,phone,email,department_id as departmentId,remark,state,create_time as createTime ,last_time as lastTime
  FROM
    user_info
  WHERE 1=1
    `
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
  if (query.email) {
    where += " and phone like ?";
    params.push("%" + query.email + "%");
  }
  if (query.startTime) {
    where += " and create_time >= ?";
    params.push(query.startTime);
  }
  if (query.endTime) {
    where += " and create_time <= ?";
    params.push(query.endTime);
  }
  // 继续组装sql
  sql += where
  totalSql += where
  // 排序字段，默认id排序
  if (query.orderBy) {
    sql += ` ORDER BY ${query.orderBy} ${query.sortOrder}`
  }
  // 执行查询
  queryPageData(sql, totalSql, params, query)
    .then(d => {
      const resData = new ResponseData()
      resData.data = d
      res.send(resData)
    })
    .catch(err => {
      res.send(new ResponseData(0, err))
    })
})

// 获取单个详情，用于编辑展示，包含角色、部门的id、名称
router.get('/user/:id', (req, res) => {
  const sql = `
  SELECT
    u.id,u.name,u.avatar,u.nickname,u.gender,u.phone,u.email,u.department_id,dep.name as departmentName,u.remark,u.state,u.create_time as createTime ,u.last_time as lastTime,
    GROUP_CONCAT(r.name) AS roleNames,GROUP_CONCAT(r.id) AS roleIds
  FROM
    user_info AS u
  LEFT JOIN
    user_role AS ur ON u.id = ur.user_id
  LEFT JOIN
    role AS r ON ur.role_id = r.id
  LEFT JOIN
    department AS dep on u.department_id = dep.id
  WHERE u.id = ?
    `
  const params = [req.params.id];
  queryData(sql, params, function(resData, rows) {
    if (rows && rows.length > 0) {
      resData.data = rows[0];
    }
    else {
      resData.setError('用户不存在：' + req.params.id);
    }
    res.send(resData);
  })
})

// 更新（新增+修改）后端基于id来判断，包含角色关联信息
// 修改时：密码不填写则不处理
router.post('/user', (req, res) => {
  let sql = ''
  const now = Date.now()
  const data = req.body
  // 密码处理，修改时不设置密码则不会更新密码值
  let pwd = null
  if (data.pwd) {
    pwd = gm.sm2Decrypt(data.pwd)
    pwd = gm.sm3Hash(pwd)
  }
  let params = [data.name, data.nickname, pwd
    , data.avatar, data.gender, data.phone, data.email
    , data.departmentId, data.remark, data.state];
  // 修改-update
  if (data.id) {
    params.push(data.id)
    sql = `
      UPDATE user_info
        SET name = ?, nickname = ?, pwd = ?, avatar = ?, gender = ?,
            phone = ?, email = ?, department_id = ?, remark = ?, state = ?,
            last_time = ${now}
        WHERE id = ? `
    // 如果没有设置密码，则去掉密码项，只针对修改模式（前端控制）
    if (!pwd) {
      params.splice(2, 1)
      sql = sql.replace('pwd = ?,', '')
    }
    executeSql(sql, params, function(resData) {
      saveUserRoles(data.id, data.roleIds)
      res.send(resData);
    })
  }
  // 新增-insert 
  else {
    sql = `INSERT INTO user_info(name,nickname,pwd,avatar,gender,phone,email,department_id,remark,state,create_time,last_time)
     values(?,?,?,?,?,?,?,?,?,?,${now},${now}) `
    // 执行insert
    executeSql(sql, params, function(resData, rows) {
      // 获取最新id,不支持同时执行两种语句
      queryData('SELECT last_insert_rowid() as id  from user_info LIMIT 1;', [], (d, rows) => {
        console.log(rows)
      })

      const userId = rows?.[0]?.id
      saveUserRoles(userId, data.roleIds)
      res.send(resData);
    })
  }
})

// 保存用户角色：差异更新用户-角色关联表
function saveUserRoles(userId, roleIds) {
  if (!userId) {
    console.error('saveUserRoles Error, userId is invalid:' + userId)
    return
  }
  // 先获取原有角色
  let rsql = 'SELECT GROUP_CONCAT(role_id) as ids FROM user_role WHERE user_id = ? ORDER BY role_id'
  queryData(rsql, [userId], (resData, rows) => {
    const oldRoleIds = rows?.[0].ids
    // 判断如果相同则不处理
    if (roleIds == oldRoleIds) {
      return
    }
    // 计算出删除的，新增的角色，分别进行删除、插入操作。
    const arrOld = oldRoleIds?.split(',') ?? []
    const arrNew = roleIds?.split(',') ?? []
    const arrDelete = arrOld.filter(c => !arrNew.includes(c))
    const arrInsert = arrNew.filter(c => !arrOld.includes(c))
    // delete
    if (arrDelete.length > 0) {
      const dsql = 'DELETE FROM user_role WHERE user_id = ? and role_id in ?'
      const params = [userId, '(' + arrDelete.join(',') + ')']
      executeSql(dsql, params, () => { })
    }
    // insert
    if (arrInsert.length > 0) {
      const params = []
      let isql = 'INSERT INTO user_role(user_id,role_id) VALUES '
        + arrInsert.map(rid => `(${userId},${rid})`).join(',')
      arrInsert.map(rid => { params.push(userId, rid) })
      executeSql(isql, params, () => { })
    }
  })
}

// 还是实现了吧，按照生产级别开发
// 删除指定id的数据
router.delete('/user/:id', (req, res) => {
  const sql = 'DELETE FROM user_info where id = ?'
  const params = [req.params.id];
  executeSql(sql, params, function(resData) {
    res.send(resData);
  })
})

// 批量删除，query参数ids
// /user?ids=1,2,3
router.delete('/user', (req, res) => {
  const sql = 'DELETE FROM user_info where id in ?'
  const params = ['(' + req.query.ids + ')'];
  executeSql(sql, params, function(resData) {
    res.send(resData);
  })
})

// 个人中心：修改基本信息，只可修改部分个人私有信息
router.post('/user/profile', (req, res) => {
  const now = Date.now()
  const data = req.body
  let params = [data.avatar, data.nickname, data.gender
    , data.phone, data.email, data.remark];
  let sql = `
    UPDATE user_info
      SET avatar = ?,
          nickname = ?,
          gender = ?,
          phone = ?,
          email = ?,
          remark = ?,
          last_time = ${now}
      WHERE id = ? 
  `
  // 执行SQL
  executeSql(sql, params, function(resData) {
    res.send(resData);
  })
})

// 个人中心：修改密码
router.post('/user/profile', (req, res) => {
  const now = Date.now()
  // 密码处理
  let pwd = gm.sm2Decrypt(req.body.pwd)
  pwd = gm.sm3Hash(pwd)
  let npwd = gm.sm2Decrypt(req.body.npwd)
  npwd = gm.sm3Hash(npwd)
  //构造sql查询
  const sql = `UPDATE user_info SET pwd =?,last_time=${now} WHERE id =? and pwd =?`;
  const params = [npwd, req.body.id, pwd]
  executeSql(sql, params, function(resData) {
    res.send(resData);
  })
})

module.exports = router