//*****  初始化组件 *****/

//加载组件
let express = require('express');
//创建一个服务端服务实例server
let server = new express();

// 注册jwt的中间件
const jwt = require("./src/utils/jwt")
server.use(jwt.varify)

// 启用json解析支持，解析body数据
server.use(express.json());


//*****  加载api路由 *****/
const baseAPI = '/api';

// 用户模块（用户、角色、部门）
const users = require('./src/system/index')
server.use(baseAPI + '/system', users)

// 文件上传
const upload = require('./src/file/index')
server.use(baseAPI, upload)




//***** 静态资源  *****/
// 使用内置的“express.static”实现静态文件代理，参数为资源地址。

//图片静态资源，第一个参数为url路由，
server.use('/file', express.static('./file'));
//兼容前端的跨域代理路径
server.use('/api/file', express.static('./file'));

//管理后台"book_admin"的部署
// server.use('/bookadmin', express.static('./book_admin'));

// const fs = require('fs')
// const rpath = require('path')
// //前端路由的重定向
// server.get('/bookadmin/*', function(req, res) {
//   const html = fs.readFileSync(rpath.resolve(__dirname, '../server/book_admin/index.html'), 'utf-8')
//   res.send(html)
// })


//*****  配置端口，启用监听端口 *****/
const port = 3000
server.listen(port, err => {
  if (!err)
    console.log('服务器启动成功，地址：http://localhost:' + port)
})