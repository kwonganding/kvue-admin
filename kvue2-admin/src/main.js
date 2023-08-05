import Vue from "vue"
import App from "./App.vue"
import store from './store'
import router from './router'
import './directive/permission'
import './plugins/element.js'
import './utils/extends'
import './styles/index.less'

Vue.config.productionTip = false

import settings from '@/settings'


//全局注入axios接口
import { service, get, post } from './utils/request'
Vue.prototype.$axios = service
Vue.prototype.$get = get
Vue.prototype.$post = post


new Vue({
  store,
  router,
  render: (h) => h(App),
  created() {
    settings.load()
  }
}).$mount("#app")
