import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './user'
import tagsBar from './tagsBar'

export default new Vuex.Store({
  state: {
  },
  getters: {
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    cacheRoutes: (state, getters) => getters['tagsBar/cacheRoutes'],
    cacheNames: (state, getters) => getters['tagsBar/cacheNames'],
  },
  modules: {
    user, tagsBar
  },
})
