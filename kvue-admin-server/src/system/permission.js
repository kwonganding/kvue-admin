
/*           权限菜单资源-管理接口                */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData } = require('../db/db.js');
const ResponseData = require('../utils/response.js');
const Table = require('../utils/Table.js')
const Base = require('../utils/Base.js')

const sqlHelper = require('../utils/sql-helper.js');


class Permission extends Base {
  constructor() {
    super()
    this.table = new Table('sys_permission', 'permission', '菜单资源')
    this.config(this.table)
  }
  config(table) {
    super.config(table)
    table.add('title', '%')
    table.add('name', '%')
    table.add('order_num')
    table.add('pid')
    table.add('type','in')
    table.add('icon')
    table.add('menu_type')
    table.add('path')
    table.add('view')
    table.add('visible')
    table.add('cache')
    table.add('remark', '%')
  }

  //绑定路由信息
  route(router) {
    super.route(router)
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/list`, (req, res) => this.getList(req, res))
  }
}
new Permission().route(router)
module.exports = router
