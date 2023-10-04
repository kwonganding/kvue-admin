
const ResponseData = require('../utils/response');
const sqlHelper = require('../utils/sql-helper.js')
const { db, queryPageData, executeSql, queryData } = require('../db/db.js');

// 数据层CRUD处理的基类，基于表配置实现了单表的增删改查接口
class Base {
  // 表结构配置，具体类实现表结构配置
  table = undefined

  //构造器，子类必须实现，初始化Table配置
  constructor() {
  }

  /**
   * 配置表的字段等信息，这里配置了几个基础通用的字段
   * @param {Table} table 
   */
  config(table) {
    table.add('id', '=').set({ pk: true })
    table.add('state')
    table.add('create_time', '<>').set({ update: false, customValue: Date.now })
    table.add('last_time', '<>').set({ customValue: Date.now })
  }

  /**
   * 标准的列表查询，无分页
   */
  getList(req, res) {
    let listSql = sqlHelper.select(this.table)
    let params = [];
    const query = req.query  // 标准查询结构
    let where = sqlHelper.where(this.table, query, params)
    where += this.appendWhere(query, params)
    // 继续组装sql
    listSql += ` WHERE 1=1 ` + where
    // 排序
    listSql += sqlHelper.orderBy(query)
    // 执行查询
    queryData(listSql, params)
      .then(data => {
        res.send(new ResponseData(data))
      })
      .catch(err => {
        console.error(err)
        res.send(new ResponseData().setError(err))
      })
  }

  /**
   * 标准的列表查询，含分页
   */
  getPageList(req, res) {
    let totalSql = sqlHelper.total(this.table)
    let listSql = sqlHelper.select(this.table)
    let params = [];
    const query = req.query  // 标准查询结构
    let where = sqlHelper.where(this.table, query, params)
    where += this.appendWhere(query, params)
    // 继续组装sql
    listSql += ` WHERE 1=1 ` + where
    totalSql += ` WHERE 1=1 ` + where
    // 执行查询
    queryPageData(listSql, totalSql, params, query)
      .then(data => {
        res.send(new ResponseData(data))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(err))
      })
  }

  /**
   * 追加where条件，按需重写即可
   */
  appendWhere(query, params) {
    return ''
  }

  /**
   * 根据主键id查询数据详情
   */
  getById(req, res) {
    const sql = sqlHelper.select(this.table) + ' WHERE id=?'
    const params = [req.params.id];
    queryData(sql, params)
      .then(rows => {
        res.send(new ResponseData(rows?.[0]))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(err))
      })
  }

  /**
   * 新增or更新单表数据
   */
  async saveOrUpdate(req, res) {
    let keyId = req.body.id
    try {
      if (keyId) {      // 修改-update
        await this.update(req, res, keyId)
      }
      else {      // 新增-insert 
        keyId = await this.insert(req, res)
      }
    }
    catch (err) {
      console.log(err)
      const resData = new ResponseData()
        .setError(`保存${this.table.title}（${keyId}）发生错误：${err}`)
      res.send(resData)
      return
    }
    this.saveContinue(req, res, keyId)
  }

  /**
   * 基本信息保存成功后的后续操作，默认发送成功消息
   * @param {*} keyId 主键id
   */
  saveContinue(req, res, keyId) {
    res.send(new ResponseData(keyId, `保存${this.table.title}（${keyId}）成功！`))
  }

  /**
   * 插入单表数据
   */
  async insert(req, res) {
    const params = []
    const sql = sqlHelper.insert(this.table, req.body, params)
    return await executeSql(sql, params)
  }
  /**
   * 更新单表数据
   */
  async update(req, res) {
    const params = []
    const sql = sqlHelper.update(this.table, req.body, params)
    return await executeSql(sql, params)
  }

  /**
   * 根据id删除数据，id支持多个，逗号隔开
   */
  deleteById(req, res) {
    const ids = req.params.id
    // 参数化
    if (!ids) {
      res.send(new ResponseData().setError(this.table.title + '删除失败，参数为空'))
      return
    }
    const arr = ids.split(',')
    const sql = `DELETE FROM ${this.table.name} WHERE id in (${arr.map(a => '?').join(',')})`
    executeSql(sql, arr)
      .then(() => {
        res.send(new ResponseData(null, `${this.table.title}删除成功：${ids}`))
      })
      .catch(err => {
        console.log(err)
        res.send(new ResponseData().setError(`删除${this.table.title}（${keyId}）发生错误：${err}`))
      })
  }

  /**
   * 统一配置路由信息
   * @param {*} router 
   */
  route(router) {
    // 注意这里必须用箭头函数，避免this丢失
    router.get(`/${this.table.code}/id/:id`, (req, res) => this.getById(req, res))
    router.post(`/${this.table.code}`, (req, res) => this.saveOrUpdate(req, res))
    router.delete(`/${this.table.code}/:id`, (req, res) => this.deleteById(req, res))
  }
}

module.exports = Base