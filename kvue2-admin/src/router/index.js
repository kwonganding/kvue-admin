import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import defaultSetting from '@/settings'
import { buildRoutes } from './routes'

import Layout from '../layout'
import Login from '../views/login/login.vue'

Vue.use(VueRouter)

/*
 * 路由属性说明：
 * name：组件名称，同组件申明时的name。在<keep-alive :include="cacheNames">中使用，用于确定缓存的组件范围
 * meta.title：标题
 * meta.icon：icon图标
 * meta.affix：是否固定，固定在标签栏，默认加载到标签栏，且不可删除
 */

/**
 * 本地的固定路由，无需权限
 */
const constantRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'Layout',
    redirect: '/home',
    children: [
      {
        path: '/404',
        name: 'page404',
        meta: { title: '404' },
        component: () => import('@/views/404.vue')
      },
      {
        path: '/redirect/:path(.*)',
        name: 'redirect',
        component: () => import('@/layout/redirect.vue')
      },
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true },
        component: () => import('@/views/home.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        meta: { title: '个人中心', icon: 'el-icon-user' },
        component: () => import('@/views/profile')
      },
    ],
  },
  {
    path: '/login',
    meta: { title: "登录" },
    component: Login,
  }
]

//创建路由器
const createRouter = () => new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }), //切换时滚动到顶部y
  routes: constantRoutes,
})
let router = createRouter()

//全局守卫，每个路由导航前：// 验证token
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login')
    return next()
  if (!store.getters.token)
    return next('/login')
  if (store.getters.userInfo)
    return next()

  // 首次进入、刷新进入：获取用户信息，包括权限，基于权限资源初始化路由、系统菜单
  store.dispatch('user/getInfo')
    .then(() => {
      // 基于用户权限处理路由、菜单，都统一添加到框架页下面
      //TODO：这里参数应掺入服务端返回的路由权限数据
      const authResource = []
      const routeItems = buildRoutes(authResource)
      router.addRoutes(routeItems)
      // 由于更新了路由，需重新设置当前路由目标。replace: true替换，不会产生历史记录
      return next({ ...to, replace: true })
    })
    .catch(err => {
      console.log('user/getInfo', err)
    })
})
// 全局守卫，每个路由导航后：更新标题
router.afterEach((to) => {
  document.title = defaultSetting.getPageTitle(to.meta.title)
})

/**
 * 重置路由（权限），退出登录时调用
 */
export function resetRouter() {
  router.matcher = createRouter().matcher
}

export default router
