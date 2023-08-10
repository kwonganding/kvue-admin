let express = require('express');
const jwt = require("../utils/jwt")
let router = express.Router();
const db = require('../db/db.js');
const gm = require('../utils/gm.js')

// 登录页：登录，密码加密传输
router.post('/auth/login', (req, res) => {
  //构造sql查询
  const sql = 'select id,name,state from user_info where name=? and pwd=?';
  // sm2解密，sm3哈希值
  let pwd = gm.sm2Decrypt(req.body.pwd)
  pwd = gm.sm3Hash(pwd)
  const params = [req.body.name, pwd];
  db.queryData(sql, params, function(resData, rows) {
    if (!rows || rows.length <= 0) {
      resData.setError('用户名或密码错误');
    }
    else if (rows[0].state != 'normal') {
      resData.setError('该用户已被冻结');
    }
    else {
      resData.message = '登录成功';
      resData.data = jwt.create(rows[0].name);
    }
    res.send(resData);
  })
})


// 获取用户信息，包括授权信息
router.get('/auth/getInfo', (req, res) => {
  //构造sql查询
  const sql = 'select id,name,avatar from user_info where name=? '
  const rsql = ''
  const psql = ''


  const params = [req.payload.name];
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