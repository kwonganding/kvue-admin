
import { login, getInfo, logout } from '@/api/user'
import { resetRouter, default as router } from '@/router'
import setting from '@/settings'

/**
 * sessionStorage保存token的Key
 */
const KEY_TOKEN = setting.title + '_TOKEN'

// 存储用户信息
const state = {
  token: sessionStorage.getItem(KEY_TOKEN),
  userInfo: null,   // 用户基本信息{id,name,avatar},默认必须为null，会以此来判断是否更新
}

// 同步mutations
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    //sessionStorage 中存储一份，避免刷新时丢失
    sessionStorage.setItem(KEY_TOKEN, token)
  },
  SET_USERINFO: (state, user) => {
    state.userInfo = Object.freeze(user)
  },
}

// 异步actions
const actions = {
  /**
   * 登录
   * @param {*} context 上下文
   * @param {*} obj 用户对象
   * @returns promise
   */
  login: (context, obj) => {
    return new Promise((resolve, reject) => {
      login(obj).then(data => {
        context.commit('SET_TOKEN', data.data)
        resolve(data.message)
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 获取用户信息
   * @param {*} context 上下文
   * @returns promise
   */
  getInfo: (context) => {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(data => {
          context.commit('SET_USERINFO', data.data)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  /**
   * 退出登录，清除token、用户信息、保存的标签数据
   * @param {} context
   */
  logout: (context) => {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        context.commit('SET_TOKEN', '')
        context.commit('SET_USERINFO', null)
        // 这里调用其他vuex模块的 mutation，注意带上参数{root:true}
        context.commit('tagsBar/CLEAR', null, { root: true })
        resetRouter()
        router.push('/login')
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
