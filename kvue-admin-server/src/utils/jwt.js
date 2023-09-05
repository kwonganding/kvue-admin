// 基于JWT 的授权管理
/* 有效期规则：
1、jwt为空、解析异常，判定为jwt无效
2、超过exp有效期判定为失效
3、有效期内请求，会重新刷新有效期exp
*/

// 用于jwt的base64编码
const base64url = require('base64url');
// 国密
const { sm2Signature, sm2VerifySignature } = require("./gm.js");

const ResponseData = require('./response.js');
const JWT_HEADER_KEY = 'authtoken'

/**
 * 创建JWT对象的构造器
 * @param {string} userName 
 * @param {number} maxage 有效时长（单位秒），默认4个小时
 */
function JWT(userName, maxage = 4 * 3600) {
  this.header = {
    alg: 'sm2', // 加密算法，采用国密算法（非对称）实现
    type: 'JWT' // 数据类型，固定为JWT
  }
  this.payload = {
    name: userName,
    exp: Date.now() + maxage * 1000  // jwt有效时间
  }
}

/**
 * 创建JWT，并对JWT编码、签名
 * @param {string} userName 用户名
 * @returns 编码、签名后的字符串
 */
function createJWT(userName) {
  const jwt = new JWT(userName)
  const header = JSON.stringify(jwt.header)
  const payload = JSON.stringify(jwt.payload)
  // sm3签名
  const signature = sm2Signature(header + '.' + payload)

  // base64编码header、payload，并组装
  const encoded = base64url.encode(header) + '.' + base64url.encode(payload) + '.' + signature
  return encoded
}

/**
 * express中间件，用于拦截所有请求进行JWT授权验证,验证失败会提前结束请求，返回错误
 */
function varifyJWT(req, res, next) {
  let { url, headers: { [JWT_HEADER_KEY]: token } } = req

  // 处理例外情况
  if (url.includes('/auth/login') || url.includes('/file'))
    return next()

  // 解析Token，验证签名，验证时间
  token ??= ''
  const arrs = token.split('.')
  if (!arrs || arrs.length !== 3)  // jwt无效
    return res.send(new ResponseData().setCode(4001))
  const header = base64url.decode(arrs[0])
  const payload = base64url.decode(arrs[1])

  // 验证签名 
  if (!sm2VerifySignature(header + '.' + payload, arrs[2])) {
    return res.send(new ResponseData().setCode(4001))
  }

  // 验证过期时间
  const payloadObj = JSON.parse(payload)
  if (payloadObj.exp <= Date.now()) {
    return res.send(new ResponseData().setCode(4002))
  }
  // 都没问题，更新jwt(主要是时间),
  let njwt = createJWT(payloadObj.name)
  // token载荷放到req上
  req.payload = payloadObj
  // 返回的新的jwt
  res.setHeader(JWT_HEADER_KEY, njwt)
  next()
}

module.exports = { create: createJWT, varify: varifyJWT }
