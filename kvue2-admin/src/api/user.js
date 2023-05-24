import { service, Get } from '@/utils/request'

/**
 * 用户登录
 * @param {any} data 用户信息
 */
export function login(data) {
  return service.post("/auth/login", data)
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
export function getInfo(token) {
  return Get("/auth/getInfo", { id: token })
}

