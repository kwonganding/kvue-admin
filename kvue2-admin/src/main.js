import Vue from "vue"
import App from "./App.vue"
import store from './store'
import router from './router'
import './plugins/element.js'
import './styles/index.less'

Vue.config.productionTip = false

import settings from '@/settings'


//全局注入axios接口
import request from './utils/request'
Vue.prototype.$axios = request


new Vue({
  store,
  router,
  render: (h) => h(App),
  created() {
    settings.load()
  }
}).$mount("#app")
