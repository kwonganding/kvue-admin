// 登录授权

let express = require('express');
const jwt = require("../utils/jwt")
let router = express.Router();
const db = require('../db/db.js');
const gm = require('../utils/gm.js')

// 登录：/login
router.post('/auth/login', (req, res) => {
  //构造sql查询
  let sql = 'select id,name from user_info where name=? and pwd=?';
  // sm2解密，sm3哈希值
  let pwd = gm.sm2Decrypt(req.body.pwd)
  pwd = gm.sm3Hash(pwd)
  let params = [req.body.name, pwd];
  db.queryData(sql, params, function(resData, rows) {
    if (rows && rows.length > 0) {
      resData.message = '登录成功';
      resData.data = jwt.create(rows[0].name);
    }
    else {
      resData.setError('用户名或密码错误');
    }
    res.send(resData);
  })
})


// 获取用户信息，包括授权信息
router.get('/auth/getInfo', (req, res) => {
  //构造sql查询
  let sql = 'select id,name,avatar from user_info where name=? ';
  let params = [req.payload.name];
  db.queryData(sql, params, function(resData, rows) {
    if (rows && rows.length > 0) {
      resData.data = rows[0];
    }
    else {
      resData.setError('用户不存在：' + req.query);
    }
    res.send(resData);
  })
})

module.exports = router