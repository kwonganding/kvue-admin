// 统一导出

const auth = require('./auth')
const user = require('./user')
const role = require('./role')
const department = require('./department')

module.exports = [auth, user, role, department]
