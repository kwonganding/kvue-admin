// 统一导出

const auth = require('./auth')
const user = require('./user')
const role = require('./role')
const department = require('./department')
const dict = require('./dict')
const dictdata = require('./dict-data')

module.exports = [auth, user, role, department, dict, dictdata]
