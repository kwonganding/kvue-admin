
/*           角色-管理接口                */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData } = require('../db/db.js');
const ResponseData = require('../utils/response.js');
const Table = require('../utils/Table.js')
const Base = require('../utils/Base.js')

const sqlHelper = require('../utils/sql-helper.js');


class Departmet extends Base {
  constructor() {
    super()
    this.table = new Table('sys_role', 'role', '角色')
    this.config(this.table)
  }
  config(table) {
    super.config(table)
    table.add('name', '%')
    table.add('remark', '%')
  }

  /**
 * 根据主键id查询数据详情
 */
  async getById(req, res) {
    const sql = sqlHelper.select(this.table) + ' WHERE id=?'
    const params = [req.params.id];
    queryData(sql, params)
      .then(rows => {
        const role = rows?.[0]
        queryData('select per_id from sys_role_permission where role_id = ?', [role.id]).then(proles => {
          role.perIds = proles.map(s => s['per_id'])
        }).finally(() => {
          res.send(new ResponseData(role))
        })
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(err))
      })
  }
  
  /**
   * 基本信息保存成功后的后续操作，默认发送成功消息
   * @param {*} keyId 主键id
   */
  saveContinue(req, res, keyId) {
    const permissionIds = req.body.perIds
    // 保存用户角色信息
    this.saveRolePermission(keyId, permissionIds)
      .then(() => {
        res.send(new ResponseData(keyId, `保存${this.table.title}（${keyId}）成功！`))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(`保存${this.table.title}（${keyId}）-授权信息发生错误：${err}`))
      })
  }


  // 保存角色授权信息
  async saveRolePermission(roleId, permissionIds) {
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


  //绑定路由信息
  route(router) {
    super.route(router)
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/list`, (req, res) => this.getPageList(req, res))
  }
}
new Departmet().route(router)
module.exports = router


/**
 * 获取单个详情，包括角色的授权资源id集合
 */
// router.get('/role/:id', async (req, res) => {
//   const sql = `SELECT id,name,state,remark,create_time as createTime ,last_time as lastTime
//     FROM ${TABLE_NAME} WHERE id = ? `
//   const params = [req.params.id];
//   let error = null
//   // 1、获取基本信息
//   const rrows = await queryData(sql, params).catch(err => error = err)
//   const data = rrows?.[0]
//   // 2、获取资源授权信息
//   if (data) {
//     const prows = await queryData(`SELECT GROUP_CONCAT(per_id) as ids FROM sys_role_permission WHERE role_id = ?`, params)
//       .catch(err => error = err)
//     data.permissionIds = prows?.[0]?.ids?.split(',').map(s=>parseInt(s))
//   }

//   // 返回
//   if (error)
//     res.send(new ResponseData().setError(error))
//   else
//     res.send(new ResponseData(data))
// })
