let express = require('express');
let router = express.Router();
const jwt = require("../utils/jwt")
const gm = require('../utils/gm.js');
const { queryData } = require('../db/db.js');
const ResponseData = require('../utils/response');

// 登录页：登录，密码加密传输
router.post('/auth/login', (req, res) => {
  //构造sql查询
  const sql = 'select id,name,state from sys_user where name=? and pwd=?';
  // sm2解密，sm3哈希值
  let pwd = gm.sm2Decrypt(req.body.pwd)
  pwd = gm.sm3Hash(pwd)
  const params = [req.body.name, pwd];

  queryData(sql, params)
    .then(rows => {
      const resData = new ResponseData()
      if (!rows || rows.length <= 0) {
        resData.setError('用户名或密码错误');
      }
      else if (rows[0].state != 'normal') {
        resData.setError('该用户已被冻结');
      }
      else {
        resData.message = '登录成功';
        resData.data = jwt.create(rows[0].id, rows[0].name);
      }
      res.send(resData);
    })
    .catch(err => {
      res.send(new ResponseData().setError(err))
    })
})


// 获取用户信息，包括授权信息
router.get('/auth/getInfo', async (req, res) => {
  //构造sql查询
  const sql = 'select id,name,avatar,nickname from sys_user where id=? '
  const params = [req.payload.id];
  // 关联查询权限，用户id、权限id、权限状态正常
  const psql = `SELECT distinct(p.id) as id,p.title, p.name,p.type,p.pid,p.icon,p.menu_type as 'menuType',p.path,p."view",p.visible,p.cache  
  FROM sys_user_role ur
  INNER JOIN sys_role r ON ur.role_id = r.id
  INNER JOIN sys_role_permission rp ON r.id = rp.role_id
  INNER JOIN sys_permission p ON rp.per_id = p.id
  WHERE ur.user_id = ? and p.state='normal' and r.state='normal' order by p.order_num asc`

  const resData = new ResponseData()
  try {
    let rows = await queryData(sql, params)
    if (!rows || rows?.length <= 0) {
      resData.setError('用户不存在：' + req.payload.name)
      return
    }
    resData.data = rows[0]
    rows = await queryData(psql, params)
    if (!rows || rows.length < 1) return
    // 权限处理，按钮权限合并简化
    const rlist = resData.data.permissions = rows.filter(r => r.type === 'catalog' || r.type === 'menu')
    let pnames = []
    rlist.forEach(ritem => {
      pnames = rows.filter(r => r.type === 'button' && r.pid === ritem.id).map(r => r.name)
      if (pnames) ritem.permissions = pnames
    });
  }
  catch (err) {
    console.log(err)
    resData.setError(err)
  }
  finally {
    res.send(resData)
  }
})

module.exports = router