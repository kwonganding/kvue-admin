// 基础api

let express = require('express');
let router = express.Router();
const db = require('../db/db.js');

//登录：/login
router.post('/auth/login', (req, res) => {
  //构造sql查询
  let sql = 'select id,name from user_info where name=? and pwd=?';
  let params = [req.body.name, req.body.pwd];
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


//首页统计信息，基础信息：/stats_base
router.get('/stats_base', (req, res) => {
  res.json({
    status: 'OK', message: '', data: {
      user: 33224,
      book: 1334,
      order: 213,
      money: 1552.24,
    }
  })
})
//首页统计信息，订单信息：/chart_order
router.get('/stats_order', (req, res) => {
  res.json({
    status: 'OK', message: '', data: [
      { name: '1月', value: 33 },
      { name: '2月', value: 46 },
      { name: '3月', value: 245 },
      { name: '4月', value: 322 },
      { name: '5月', value: 78 },
      { name: '6月', value: 178 },
      { name: '7月', value: 278 },
    ]
  })
})
//首页统计信息，用户信息：/chart_user
router.get('/stats_user', (req, res) => {
  res.json({
    status: 'OK', message: '', data: [
      { name: '1月', value: 121 },
      { name: '2月', value: 146 },
      { name: '3月', value: 245 },
      { name: '4月', value: 478 },
      { name: '5月', value: 1278 },
      { name: '6月', value: 3450 },
      { name: '7月', value: 7890 },
      { name: '8月', value: 10000 },
      { name: '9月', value: 24567 },
    ]
  })
})

module.exports = router;
