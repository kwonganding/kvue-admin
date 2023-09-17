
/*           数据字典-类型-管理接口                */

let express = require('express');
let router = express.Router();
const { queryPageData, executeSql, queryData } = require('../db/db.js');
const ResponseData = require('../utils/response.js');
const Table = require('../utils/Table.js')
const Base = require('../utils/Base.js')

const sqlHelper = require('../utils/sql-helper.js');


class DictData extends Base {
  constructor() {
    super()
    this.table = new Table('sys_dictdata', 'dict-data', '字典数据')
    this.config(this.table)
  }
  config(table) {
    table.add('id', '=').set({ pk: true })
    table.add('name', '%')
    table.add('code')
    table.add('type')
    table.add('order_num')
    table.add('state')
    table.add('pid')
  }

  //绑定路由信息
  route(router) {
    super.route(router)
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/list`, (req, res) => this.getList(req, res))
  }
}
new DictData().route(router)
module.exports = router
