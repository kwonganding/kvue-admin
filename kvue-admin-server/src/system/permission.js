
/*           权限菜单资源-管理接口                */

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
    this.table = new Table('sys_department', 'department', '组织结构')
    this.config(this.table)
  }
  config(table) {
    super.config(table)
    table.add('name', '%')
    table.add('order_num')
    table.add('pid')
    table.add('manager', '%')
    table.add('remark', '%')
  }

  //绑定路由信息
  route(router) {
    super.route(router)
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/list`, (req, res) => this.getList(req, res))
  }
}
new Departmet().route(router)
module.exports = router
