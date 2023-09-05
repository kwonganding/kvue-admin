// 标签栏，多标签支持

import setting from '@/settings'

/**
 * sessionStorage保存token的Key
 */
const KEY_TAGSBAR = setting.title + '_TAGSBAR'

// 保存、加载sessionStorage，避免刷新页面时丢失
function saveSessionStorage(state) {
  sessionStorage.setItem(KEY_TAGSBAR, JSON.stringify(state))
}
function loadSessionStorage(state) {
  const jstr = sessionStorage.getItem(KEY_TAGSBAR)
  if (!jstr) return
  const vstate = JSON.parse(jstr)
  state.cacheNames = vstate?.cacheNames
  state.cacheRoutes = vstate?.cacheRoutes
}

export default {
  namespaced: true,
  state: {
    //注意：持久化vuex时，state需要序列化为JSON字符串，不支持组件，因此路由信息中不应包含component
    cacheRoutes: [], //缓存的路由，用于标签栏使用
    cacheNames: [],  //缓存的打开的路由名称，用于Keep-alive的缓存白名单
  },
  // state必须通过getter访问
  getters: {
    cacheRoutes(state) {
      if (state.cacheRoutes?.length == 0)
        loadSessionStorage(state)
      return state.cacheRoutes
    },
    cacheNames(state) {
      if (state.cacheNames?.length == 0)
        loadSessionStorage(state)
      return state.cacheNames
    },
  },
  mutations: {
    ADD(state, obj) {
      if (!state.cacheRoutes.some(s => s.path === obj.path))
        //添加打开的路由，只需要path、name、mata
        state.cacheRoutes.push({ path: obj.path, name: obj.name, meta: obj.meta })
      state.cacheNames = state.cacheRoutes.map(s => s.name)
      saveSessionStorage(state)
    },
    REMOVE(state, obj) {
      const i = state.cacheRoutes.findIndex(s => s.path === obj.path)
      if (i < 0)
        return
      state.cacheRoutes.splice(i, 1)
      state.cacheNames = state.cacheRoutes.map(s => s.name)
      saveSessionStorage(state)
    },
    CLEAR(state) {
      // 移除所有，除了固定的
      // 退出登录的时候调用
      const affixItems = state.cacheRoutes.filter(s => s.meta.affix)
      state.cacheRoutes = affixItems
      state.cacheNames = state.cacheRoutes.map(s => s.name)
      saveSessionStorage(state)
    },
    REMOVE_OTHERS(state, obj) {
      // 移除其他的，不含固定、当前
      state.cacheRoutes = state.cacheRoutes.filter(s => s.meta.affix || s.path === obj.path)
      state.cacheNames = state.cacheRoutes.map(s => s.name)
      saveSessionStorage(state)
    },
    // 移除缓存的名字，用于刷新
    REMOVE_NAME(state, obj) {
      const i = state.cacheNames.findIndex(s => s === obj.name)
      if (i < 0)
        return
      state.cacheNames.splice(i, 1)
    },
  },
}
