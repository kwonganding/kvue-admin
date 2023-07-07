import { get, post } from '@/utils/request'
import { encrypt } from '@/utils/encrypt'

/**
 * 用户登录
 * @param {any} data 用户信息
 */
export function login(data) {
  // 加密
  return post("/auth/login", { name: data.name, pwd: encrypt(data.pwd) })
}

/**
 * 退出登录
 * @param {any} token
 */
export function logout() {
  // return Get("/auth/logout", token)
  return Promise.resolve()
}

/**
 * 获取用户信息
 * @param {any} token
 */
export function getInfo() {
  return get("/auth/getInfo")
}

