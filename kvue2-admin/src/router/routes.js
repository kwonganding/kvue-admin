// 动态路由配置信息

import Layout from '../layout'
import { list2Tree } from '@/utils/tree'

//#region 授权资源数据结构
/**
 * 服务端存储的权限资源数据结构，树形结构，包含了目录、菜单、按钮权限资源。
 * 基于该数据会解析出两个集合：
 * menuResource：菜单资源，用于菜单展示，包含了目录、菜单
 * asyncRoutes：路由数据，挂载到框架页面下面（children），给路由组件用于路由
 */
// const item = {
//   name: 'home',       // 唯一编码，如果是组件（菜单视图），则为组件name
//   title: '工作台',     // 标题
//   url: 'views/home',  // 路由地址，目录、功能权限则不需要，不能斜杠开头
//   type: 'view',       // dictionary(目录)、view(视图组件,菜单项)、permission(按钮、请求权限)
//   show: true,         // 是否显示到菜单
//   sort: 1,            // 在菜单中的同级排序
//   icon: '',           // 图标
//   parentName: '',     // 父级name，根节点则为空
// }
//#endregion

/**
 * 本地权限资源配置，这里配置的数据仅为development调试用
 */
const localResource = [
  {
    name: 'dev-view', title: '本地开发',
    type: 'dictionary', url: '', show: true, sort: 1,
    icon: 'iconfont icon-codelibrary-fill', parentName: '',
  },
  {
    name: 'components', title: '常用组件',
    url: 'views/dev-view/components',
    type: 'view', show: true, sort: 1,
    icon: 'iconfont icon-compass', parentName: 'dev-view',
    permissions: ['add', 'edit', 'delete']
  },
  {
    name: 'userlist', title: '富文本/上传',
    url: 'views/dev-view/file-editor',
    type: 'view', show: true, sort: 2,
    icon: 'iconfont icon-file-text', parentName: 'dev-view',
  },
  {
    name: 'tt', title: '空目录',
    type: 'dictionary', url: '', show: true, sort: 1,
    icon: 'iconfont icon-codelibrary-fill', parentName: '',
  },
]

/**
 * 动态路由资源，附加到路由中，localResource、authResource处理后会追加到这里。
 */
function createAsyncRoutes() {
  return [
    // 根节点，动态资源添加到该节点children下
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: []
    },
    // 404 要放到这里，就是整体路由的最后
    { path: '*', redirect: '/404', meta: { title: '404', show: false }, }
  ]
}

/**
 * 用于菜单显示的资源，localResource、authResource处理后会追加到这里。
 */
export let menuRoutes = []

/**
 * 构建路由，根据服务端权限资源，构建菜单树、视图路由
 * @param {Array} authResource 服务端返回的权限资源
 */
export function buildRoutes(authResource) {
  // 1、初始化资源
  const items = authResource ?? []
  // 如果是开发环境，则附加本地路由资源
  if (process.env.NODE_ENV === 'development') {
    items.push(...localResource)
  }
  const asyncRoutes = createAsyncRoutes()

  // 2、先转换为标准路由数据结构
  const ritems = items.map(item => {
    let route = { name: item.name, path: item.name, meta: item }
    if (item.url) {
      // 注意这里的坑，必须 “@/”开头，作为常量字符，不能放到动态参数里。大概原因是 动态导入需要首先确定路径
      route.component = () => import(`@/${item.url}`)
    }
    return route
  })
  // 排个序
  ritems.sort((a, b) => a.meta.sort - b.meta.sort)

  // 4、构建菜单树，菜单树是包含了所有类型节点（目录、路由视图）
  menuRoutes = list2Tree(ritems, { key: 'name', parent: (n) => n.meta.parentName, children: 'children' })
  // 递归处理下path，递归父节点的name+自己的name，示例：user-center/user
  buildPath(ritems)

  // 5、筛选路由视图，添加到框架页下面，并返回
  const vitems = ritems.filter(r => r.meta.type === 'view')
  asyncRoutes[0].children.push(...vitems)
  return asyncRoutes
}

// 递归处理path路径
function buildPath(items, parentPath = '') {
  if (!items) return
  items.forEach(item => {
    if (parentPath !== '' || !item.path?.startsWith('/'))
      item.path = parentPath + '/' + item.path
    buildPath(item.children, item.path)
  })
}
