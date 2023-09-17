import service, { get, post } from '@/utils/request'
import { encrypt } from '@/utils/encrypt'

/**
 * 用户登录
 * @param {any} data 用户信息
 */
export function login(data) {
  // 加密
  return post("/system/auth/login", { name: data.name, pwd: encrypt(data.pwd) })
}

/**
 * 退出登录，没有实现
 * @param {any} token
 */
export function logout() {
  // return Get("/auth/logout", token)
  return Promise.resolve()
}

/**
 * 登录时，获取用户信息，包括部门名称、角色信息、授权数据
 */
export function getInfo() {
  return get("/system/auth/getInfo")
}

/**
 * 个人中心：修改基本信息，只可修改部分个人私有信息
 * @param {object} 用户信息
 */
export function updateProfile(data) {
  // 只保存部分信息
  const { avatar, nickname, gender, phone, email, remark, id } = data
  let pdata = { avatar, nickname, gender, remark, id }
  return post("/system/user/profile", pdata)
}

/**
 * 个人中心：修改密码
 * @param {object} 查询对象
 */
export function updatePwd(data, id) {
  // 加密一下
  const pwd = encrypt(data.pwd)
  const npwd = encrypt(data.npwd1)
  return post("/system/user/pwd", { pwd, npwd, id })
}

/*****************  crud ****************** */

/**
 * 查询列表
 * @param {object} 查询对象
 */
export function getList(query) {
  return get("/system/user/list", query)
}

/**
 * 根据id查询单个信息，用于编辑、展示
 * 包含部门名称，角色组的id、名称
 * @param {string} 主键id
 */
export function getById(id) {
  return get("/system/user/id/" + id)
}

/**
 * 新增、更新信息，后端基于id来判断
 * 修改时：密码不填写则不处理；包含角色关联信息
 * @param {object} 保存的数据对象
 */
export function saveOrUpdate(data) {
  if (data.pwd)
    data.pwd = encrypt(data.pwd)
  return post("/system/user", data)
}

/**
 * 根据主键id删除数据，支持多个。删除不可恢复，需谨慎使用！
 * @param {Array} 主键id集合
 */
export function deleteById(ids) {
  return service.delete("/system/user/" + ids)
}

