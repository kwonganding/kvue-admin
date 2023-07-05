// 采用国密sm2（非对称加密算法）加密
// 注意秘钥、密文都是16数据进制格式

import { sm2 } from 'sm-crypto-v2'

const PUBLICKEY = "04cca9a54d4b845bc99c7769ce117c867a3f182524969d97afe53c07a78116bf9008250f9f5d65d54e3db00ff9e30d202d2c30146c4db07ba54f05619e1252395b"

/**
 * sm2非对称加密（公钥加密）
 * @param {string} text 待加密文本
 * @returns 密文（16进制）
 */
export function encrypt(text) {
  return sm2.doEncrypt(text, PUBLICKEY)
}





