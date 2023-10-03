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
//   name: 'home',       // 唯一编码，如果是组件（菜单视图），则为组件name。如果是目录，则会拼接到URL上（Path）
//   title: '工作台',     // 标题
//   url: 'views/home',  // 路由地址，”views/“开头的相对路径，目录、功能权限则不需要，不能斜杠开头
//   type: 'view',       // dictionary(目录)、view(视图组件,菜单项)、permission(按钮、请求权限)
//   show: true,         // 是否显示到菜单
//   sort: 1,            // 在菜单中的同级排序
//   icon: '',           // 图标
//   parentName: '',     // 父级name，根节点则为空
//   nocache: true,        // 是否缓存视图
// }
//#endregion

/**
 * 本地权限资源配置，这里配置的数据仅为development调试用
 */
const localResource1 = [
  {
    name: 'system', title: '系统管理',
    type: 'dictionary', url: '', show: true, sort: 1,
    icon: 'el-icon-s-tools', parentName: '',
  },
  {
    name: 'user', title: '用户管理',
    type: 'view', url: 'views/system/user', show: true, sort: 1,
    icon: 'el-icon-user', parentName: 'system',
  },
  {
    name: 'role', title: '用户角色',
    type: 'view', url: 'views/system/role', show: true, sort: 2,
    icon: 'el-icon-coordinate', parentName: 'system',
  },
  {
    name: 'department', title: '组织机构',
    type: 'view', url: 'views/system/department', show: true, sort: 3,
    icon: 'iconfont icon-cluster', parentName: 'system',
  },
  {
    name: 'permission', title: '菜单资源',
    type: 'view', url: 'views/system/permission', show: true, sort: 3,
    icon: 'el-icon-menu', parentName: 'system',
  },
  {
    name: 'dict', title: '数据字典',
    type: 'view', url: 'views/system/dict', show: true, sort: 6,
    icon: 'el-icon-s-order', parentName: 'system',
  },
]

/**
 * 本地权限资源配置，这里配置的数据仅为development调试用，配置结构和服务端返回的数据一致，统一处理。
 * 转换为路由所需的数据结构，原本数据全部存储在meta中
 */
const localResource = [
  // 开发组件
  {
    id: 8000, pid: 0,
    name: 'dev', title: '开发组件', icon: 'iconfont icon-code',
    type: 'catalog', menuType: 'default', visible: 1, cache: 1,
    view: '', path: '',
  },
  {
    id: 8001, pid: 8000,
    name: 'components', title: '小组件集合', icon: 'iconfont icon-compass',
    type: 'menu', menuType: 'default', visible: 1, cache: 1,
    view: 'views/dev-view/components', path: '',
  },
  {
    id: 8002, pid: 8000,
    name: 'fileupload', title: '图片/文件上传', icon: 'el-icon-upload',
    type: 'menu', menuType: 'default', visible: 1, cache: 1,
    view: 'views/dev-view/fileupload', path: '',
  },
  {
    id: 8003, pid: 8000,
    name: 'editor', title: '富文本/上传', icon: 'el-icon-upload',
    type: 'menu', menuType: 'default', visible: 1, cache: 1,
    view: 'views/dev-view/editor', path: '',
  },
  {
    id: 8004, pid: 8000,
    name: 'utils', title: 'utils库', icon: 'iconfont icon-codelibrary-fill',
    type: 'menu', menuType: 'default', visible: 1, cache: 1,
    view: 'views/dev-view/utils', path: '',
  },
  {
    id: 8005, pid: 8000,
    name: 'enums', title: '枚举EnumFactory', icon: 'iconfont icon-codelibrary-fill',
    type: 'menu', menuType: 'default', visible: 1, cache: 1,
    view: 'views/dev-view/enums', path: '',
  },


  {
    id: 8011, pid: 8000,
    name: 'link', title: '外链-百度', icon: 'el-icon-link',
    type: 'menu', menuType: 'link', visible: 1, cache: 0,
    view: 'http://www.baidu.com', path: '',
  },
  {
    id: 8012, pid: 8000,
    name: 'link', title: '内链-百度', icon: 'el-icon-link',
    type: 'menu', menuType: 'link', visible: 1, cache: 1,
    view: 'http://www.baidu.com', path: '',
  },

  // crud模板
  {
    id: 9000, pid: 0,
    name: 'crud', title: 'crud模板', icon: 'iconfont icon-codepen-square-fill',
    type: 'catalog', menuType: 'default', visible: 1, cache: 1,
    view: '', path: '',
  },
  {
    id: 9001, pid: 9000,
    name: 'list1', title: '列表1-简单', icon: 'iconfont icon-unorderedlist',
    type: 'menu', menuType: 'default', visible: 1, cache: 1,
    view: 'views/crud-template/list1', path: '',
  },
  {
    id: 9002, pid: 9000,
    name: 'list2', title: '列表2-树列表', icon: 'el-icon-s-operation',
    type: 'menu', menuType: 'default', visible: 1, cache: 0,
    view: 'views/crud-template/list2', path: '',
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
    items.unshift(...localResource)
  }
  const asyncRoutes = createAsyncRoutes()

  // 2、先转换为标准路由数据结构
  const ritems = items.map(item => {
    let route = {
      name: item.name, id: item.id,
      path: item.path ? item.path : item.name,
      meta: item
    }
    // 注册路由
    if (item.type === 'menu' && item.menuType === 'default' && item.view) {
      // 注意这里的坑，必须 “@/”开头，作为常量字符，不能放到动态参数里。大概原因是 动态导入需要首先确定路径
      route.component = () => import(`@/${item.view}`)
    }
    return route
  })

  // 4、构建菜单树，菜单树是包含了所有类型节点（目录、路由视图）
  menuRoutes = list2Tree(ritems, { key: 'id', parent: (n) => n.meta.pid, children: 'children' })
  // 递归处理下path递归父节点的name+自己的name，示例：user-center/user
  buildPath(menuRoutes)

  console.dir(menuRoutes)

  // 5、筛选路由视图，添加到框架页下面，并返回
  const vitems = ritems.filter(r => r.component)
  asyncRoutes[0].children.push(...vitems)


  return asyncRoutes
}

// 递归处理path路径
function buildPath(items, parentPath = '') {
  if (!items) return
  items.forEach(item => {
    if (parentPath !== '' || !item.path?.startsWith('/')) {
      item.path = parentPath + '/' + item.path
    }
    buildPath(item.children, item.path)
  })
}
