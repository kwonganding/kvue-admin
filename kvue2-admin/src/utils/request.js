import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { getToken, setToken } from '@/utils/auth'

// token在Header中的key
const JWT_HEADER_KEY = 'authtoken'
const BASE_URL = process.env.VUE_APP_BASE_API  // '/api'

//配置一下NProgress，在顶部显示进度条
NProgress.configure({ showSpinner: false, minimum: 0.2, easeing: 'swing', speed: 500, trickleRate: 0.2 })

// 创建Axios实例
const service = axios.create({
  baseURL: BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截：TOKEN处理
service.interceptors.request.use(
  config => {
    NProgress.start()
    // 请求头添加token
    if (store.getters.token) {
      config.headers[JWT_HEADER_KEY] = store.getters.token
    }
    return config
  },
  error => {
    NProgress.done()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截，处理HTTP异常、返回消息错误
service.interceptors.response.use(
  // 正常响应response
  response => {
    NProgress.done()
    const data = response.data
    //获取、更新token
    const newToken = response.headers[JWT_HEADER_KEY]
    if (newToken) {
      // 将该token设置到vuex以及本地存储中
      store.commit('user/SET_TOKEN', newToken)
    }
    // 处理自定义响应状态码，数据规范：{code:0,message:'',其他数据}
    switch (data.code) {
      case 0:           // 正常返回
        return data
      case 4001:        //token无效
      case 4002:        //token过期
        console.warn(data)
        // 提示错误，询问是否重新登录
        MessageBox.confirm('登录失效或已过期，是否立即重新登录？', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            store.dispatch('user/logout')
          })
          .catch(() => { })
        break
    }
    // 处理错误返回：消息提示+日志记录
    console.error(data)
    Message({ message: data.message, type: "error", duration: 4000 })
    // 统一处理错误，暂时不返回，后续再看情况优化
    // return Promise.reject(data.message)
  },
  // 错误error，各种HTTP的异常状态码处理
  error => {
    NProgress.done()
    console.error(error) // for debug
    const status = error?.response?.status
    let message = HTTP_ERRORS[status]
    message ??= `网络可能出现异常，错误代码：${status}`

    Message({ message, type: "error", duration: 4000 })
    // 这里应该不用返回了，都已经处理过了    // return Promise.reject(error)
  }
)

const HTTP_ERRORS = {
  '400': '错误的请求语法或请求参数！',
  '401': '未授权，无效凭据',
  '403': '客户端没有访问内容的权限！',
  '404': '404:请求资源不存在',
  '405': '方法不允许，不支持该请求',
  '408': '网络请求超时！',
  '409': '该请求与服务器的当前状态冲突！',
  '411': '服务端拒绝了该请求，Content-Length 头字段未定义',
  '413': '请求实体大于服务器定义的限制！',
  '414': '请求的 URI 比服务器愿意接收的长度长！',
  '500': '服务器好像开小差了，重试下吧！',
  '501': '服务器不支持请求方法！',
  '502': '网关错误！',
  '503': '服务不可用，服务器暂时过载或维护！',
  '504': '网关超时，请重试！',
  '505': '服务器不支持请求中使用的 HTTP 版本！',
}

function get(url, params) {
  return service.get(url, { params })
}

function post(url, params) {
  return service.post(url, params)
}

export default service
export {
  service,
  BASE_URL as baseURL,
  get, post
}

// vue全局绑定，使用：this.$api, this.$get
// Vue.prototype.$axios = service
// Vue.prototype.$get = get
// Vue.prototype.$post = post

//默认情况下，axios 使用 application/json 格式来发送请求数据。如果服务端有其他要求，则需指定格式
