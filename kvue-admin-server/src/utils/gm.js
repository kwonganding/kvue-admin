// 国密加密算法，cjs 版本
// 注意秘钥、密文都是16数据进制格式

const sm = require('sm-crypto-v2/dist/index')

// sm2 秘钥
const SM2_PRIVATEKEY = 'c46bc9568a31c5047591c81ce65afecb1070a0331cdac70808ce261330a30df3'
const SM2_PUBLICKEY = '04cca9a54d4b845bc99c7769ce117c867a3f182524969d97afe53c07a78116bf9008250f9f5d65d54e3db00ff9e30d202d2c30146c4db07ba54f05619e1252395b'

/**
 * sm3签名/摘要+加盐
 * @param {string} text 待签名内容
 * @returns 签名值
 */
function signatureWithSalt(text) {
  if (!text) return text
  // salt：采用简单的固定规则
  let sign = sm.sm3(text)
  const i = 7
  let c = (15 - Number('0x' + sign[i])).toString(16)
  sign = sign.slice(0, i) + c + sign.slice(i + 1)
  return sign
}

/**
 * sm2（公钥钥）加密
 * @param {string} text 明文字符串
 * @returns 16进制密文
 */
function sm2Encrypt(text) {
  return sm.sm2.doEncrypt(text, SM2_PUBLICKEY)
}

/**
 * sm2（私钥）解密
 * @param {string} encrypted 16进制密文
 * @returns 明文
 */
function sm2Decrypt(encrypted) {
  return sm.sm2.doDecrypt(encrypted, SM2_PRIVATEKEY)
}

/**
 * sm2私钥签名
 * @param {string} text 明文字符串
 * @returns 16进制签名值
 */
function sm2Signature(text) {
  return sm.sm2.doSignature(text, SM2_PRIVATEKEY)
}

/**
 * sm2公钥验签
 * @param {*} text 明文字符串
 * @param {*} signHash 签名值
 * @returns 是否验证通过bool
 */
function sm2VerifySignature(text, signHash) {
  return sm.sm2.doVerifySignature(text, signHash, SM2_PUBLICKEY)
}


module.exports = { signatureWithSalt, sm2Encrypt, sm2Decrypt, sm2Signature, sm2VerifySignature };