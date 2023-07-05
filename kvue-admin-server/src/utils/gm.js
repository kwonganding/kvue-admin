
// 国密加密算法，cjs 版本
// 注意秘钥、密文都是16数据进制格式
const sm = require('sm-crypto-v2/dist/index')

// sm2 私钥
const SM2_PRIVATEKEY = 'c46bc9568a31c5047591c81ce65afecb1070a0331cdac70808ce261330a30df3'

/**
 * sm3签名
 * @param {string} text 待签名内容
 * @returns 签名值
 */
function signature(text) {
  return sm.sm3(text)
}

/**
 * sm2（私钥）解密
 * @param {string} encrypted 16进制密文
 * @returns 明文
 */
function sm2Decrypt(encrypted) {
  return sm.sm2.doDecrypt(encrypted, SM2_PRIVATEKEY)
}

module.exports = { signature, sm2Decrypt };