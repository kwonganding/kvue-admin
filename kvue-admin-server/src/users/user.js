// 登录授权

let express = require('express');
let router = express.Router();
const db = require('../db/db.js');
const gm = require('../utils/gm.js')

// 登录：/login
router.post('/auth/login', (req, res) => {
  //构造sql查询
  let sql = 'select id,name from user_info where name=? and pwd=?';
  // 解密+摘要
  let pwd = gm.sm2Decrypt(req.body.pwd)
  // pwd = gm.signature(pwd)
  let params = [req.body.name, pwd];
  db.queryData(sql, params, function(resData, rows) {
    if (rows && rows.length > 0) {
      resData.message = '登录成功';
      resData.token = rows[0].id;
    }
    else {
      resData.message = '用户名或密码错误';
      resData.code = 400;
    }
    res.send(resData);
  })
})


router.get('/auth/logout', (req, res) => {

})

// 获取用户信息，包括授权信息
router.get('/auth/getInfo', (req, res) => {
  //构造sql查询
  let sql = 'select id,name,avatar from user_info where id=? ';
  let params = [req.query.id];
  db.queryData(sql, params, function(resData, rows) {
    if (rows && rows.length > 0) {
      resData.userInfo = rows[0];
    }
    else {
      resData.message = '用户不存在：' + req.query;
      resData.code = 400;
    }
    res.send(resData);
  })
})

module.exports = router