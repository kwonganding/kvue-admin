import service, { get, post } from '@/utils/request'

/*****************  crud ****************** */

/**
 * 查询列表
 * @param {object} 查询对象
 */
export function getList(query) {
  return get("/system/dict-data/list", query)
}

/**
 * 根据id查询单个信息，用于编辑、展示
 * @param {string} 主键id
 */
export function getById(id) {
  return get("/system/dict-data/id/" + id)
}

/**
 * 新增、更新信息，后端基于id来判断
 * @param {object} 保存的数据对象
 */
export function saveOrUpdate(data) {
  // 父级pid默认0
  data.pid ??= 0
  return post("/system/dict-data", data)
}

/**
 * 根据主键id删除数据，支持多个。删除不可恢复，需谨慎使用！
 * @param {Array} 主键id集合
 */
export function deleteById(ids) {
  return service.delete("/system/dict-data/" + ids)
}

