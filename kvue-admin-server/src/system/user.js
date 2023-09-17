/*           用户信息-管理接口                */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData } = require('../db/db.js');
const ResponseData = require('../utils/response.js');
const Table = require('../utils/Table.js')
const Base = require('../utils/Base.js')

const sqlHelper = require('../utils/sql-helper.js');

const gm = require('../utils/gm.js');

// 密码解密-哈希
function pwdConverter(pwd) {
  return gm.sm3Hash(gm.sm2Decrypt(pwd))
}

/**
 * User 用户管理接口
 */
class User extends Base {
  constructor() {
    super()
    this.table = new Table('sys_user', 'user', '用户信息')
    this.config(this.table)
  }
  config(table) {
    super.config(table)
    // name/nickname自定义构造where
    table.add('name', '%').set({ where: false })
    table.add('nickname', '%').set({ where: false })
    table.add('gender')
    table.add('avatar')
    table.add('pwd').set({ select: false, converter: pwdConverter })
    table.add('phone', '%')
    table.add('email', '%')
    table.add('department_id', 'in')
    table.add('remark', '%')
  }

  /**
 * 追加where条件，按需重写即可
 */
  appendWhere(query, params) {
    let where = ''
    if (query.name) {
      where = " and (name like ? or id like ?)";
      params.push("%" + query.name + "%");
      params.push("%" + query.name + "%");
    }
    return where
  }

  /**
 * 根据主键id查询数据详情
 * 需包含部门名称，角色组的id、名称
 */
  getById(req, res) {
    const sql = `SELECT ${sqlHelper.selectColumns(this.table, 'u')},dep.name as departmentName,
      GROUP_CONCAT(r.name) AS roleNames,GROUP_CONCAT(r.id) AS roleIds
      FROM
        ${this.table.name} AS u
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
          resData.data.roleIds = resData.data.roleIds?.split(',').map(s => parseInt(s))
          resData.data.roleNames = resData.data.roleNames?.split(',')
        }
        else
          resData.setError('用户不存在：' + req.params.id)
        res.send(resData)
      })
      .catch(err => {
        res.send(new ResponseData().setError(err))
      })
  }

  /**
   * 基本信息保存成功后的后续操作，默认发送成功消息
   * 保存用户角色：差异更新用户-角色关联表
   * @param {*} keyId 主键id
   */
  saveContinue(req, res, keyId) {
    const roleIds = req.body.roleIds
    // 保存用户角色信息
    this.saveUserRoles(keyId, roleIds)
      .then(() => {
        res.send(new ResponseData(keyId, `保存${this.table.title}（${keyId}）成功！`))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(`保存${this.table.title}（${keyId}）-角色发生错误：${err}`))
      })
  }

  // 保存用户角色：差异更新用户-角色关联表
  async saveUserRoles(userId, roleIds) {
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

  updateProfile(req, res) {
    const now = Date.now()
    const data = req.body
    let params = [data.avatar, data.nickname, data.gender, data.phone, data.email, data.remark, data.id];
    let sql = `UPDATE ${this.table.name}
        SET avatar = ?, nickname = ?, gender = ?, phone = ?, email = ?, remark = ?,
            last_time = ${now}
        WHERE id = ? `
    // 执行SQL
    executeSql(sql, params)
      .then(() => {
        res.send(new ResponseData(data.id, '个人信息更新成功！'))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(err))
      })
  }

  updatePwd(req, res) {
    const now = Date.now()
    // 密码处理
    let pwd = pwdConverter(req.body.pwd)
    let npwd = pwdConverter(req.body.npwd)
    //构造sql查询
    const sql = `UPDATE ${this.table.name} SET pwd =?,last_time=${now} WHERE id =? and pwd =?`;
    const params = [npwd, req.body.id, pwd]
    // 执行SQL
    executeSql(sql, params)
      .then(() => {
        res.send(new ResponseData(null, '用户密码更新成功！'))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError("更新失败，可能是旧密码错误。" + err))
      })
  }

  //绑定路由信息
  route(router) {
    super.route(router)
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/list`, (req, res) => this.getPageList(req, res))
    router.post(`/${this.table.code}/profile`, (req, res) => this.updateProfile(req, res))
    router.post(`/${this.table.code}/pwd`, (req, res) => this.updatePwd(req, res))
  }
}

new User().route(router)

module.exports = router