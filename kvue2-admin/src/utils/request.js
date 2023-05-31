import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { getToken, setToken } from '@/utils/auth'

// token在Header中的key
const JWT_HEADER_KEY = 'authtoken'
const BASE_URL = process.env.VUE_APP_BASE_API

//配置一下NProgress，在顶部显示进度条
NProgress.configure({ showSpinner: false, minimum: 0.2, easeing: 'swing', speed: 500, trickleRate: 0.2 })

// 创建Axios实例
const service = axios.create({
  baseURL: BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  config => {
    NProgress.start()
    // 请求头添加token
    if (store.getters.token) {
      config.headers[JWT_HEADER_KEY] = store.token
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

// 响应拦截
service.interceptors.response.use(
  // 正常响应response
  response => {
    NProgress.done()
    const data = response.data
    console.log(data)
    //获取、更新token
    const newToken = response.headers[JWT_HEADER_KEY]
    if (newToken) {
      // 将该token设置到vuex以及本地存储中
      store.commit('SET_TOKEN', newToken)
    }
    // 处理自定义响应状态码，数据规范：{code:0,message:'',其他数据}
    switch (data.code) {
      case 0:           // 正常返回
        return data
      case 4001:        //token过期
        break
      default:
        throw new Error(data.message)
    }
  },
  // 错误error，各种HTTP的异常状态码处理
  error => {
    NProgress.done()
    console.log(error) // for debug
    let message = "网络可能出现异常"
    const status = error?.response?.status
    switch (status) {
      case 500:
        message = "服务器好像开小差了，重试下吧！"
        break
      case 400:
        message = "提交数据出错"
        break
      case 401:
        message = "没有权限"
        break
      case 404:
        message = "请求资源不存在"
        break
      default: return Promise.reject(error)
    }
    Message({ message, type: "error", duration: 4000 })
    // 这里应该不用返回了，都已经处理过了    // return Promise.reject(error)
  }
)

function Get(url, params) {
  return service.get(url, { params })
}

export default service
export {
  service,
  BASE_URL as baseURL,
  Get
}

//默认情况下，axios 使用 application/json 格式来发送请求数据。如果服务端有其他要求，则需指定格式
