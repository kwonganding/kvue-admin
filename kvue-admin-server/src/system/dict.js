
/*           数据字典-类型-管理接口                */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData } = require('../db/db.js');
const ResponseData = require('../utils/response.js');
const Table = require('../utils/Table.js')
const Base = require('../utils/Base.js')

const sqlHelper = require('../utils/sql-helper.js');


class Dict extends Base {
  constructor() {
    super()
    this.table = new Table('sys_dict', 'dict', '字典类型')
    this.config(this.table)
  }
  config(table) {
    table.add('id', '=').set({ pk: true })
    table.add('name', '%')
    table.add('type')
    table.add('is_tree')
  }


  // 根据type获取所有有效字典数据
  getDataByType(req, res) {
    const sql = `SELECT id, name, code, pid FROM sys_dictdata WHERE state='normal' AND type = ? ORDER BY order_num ASC`
    queryData(sql, [req.params.type])
      .then(rows => {
        res.send(new ResponseData(rows))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(err))
      })
  }

  //绑定路由信息
  route(router) {
    super.route(router)
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/list`, (req, res) => this.getList(req, res))
    router.get(`/${this.table.code}/type/:type`, (req, res) => this.getDataByType(req, res))
  }
}
new Dict().route(router)
module.exports = router
