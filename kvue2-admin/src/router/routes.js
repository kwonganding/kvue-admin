// 动态路由配置信息

/**
 * 服务端存储的权限资源数据结构，树形结构，包含了目录、菜单、按钮权限资源。
 * 基于该数据会解析出两个集合：
 * menuResource：菜单资源，用于菜单展示，包含了目录、菜单
 * asyncRoutes：路由数据，挂载到框架页面下面（children），给路由组件用于路由
 */
const item = {
  key: 'home',    // 唯一编码，如果是组件，则为组件Name
  title: '工作台', // 标题
  url: '/home',   // 路由地址，目录、功能权限则不需要，不能斜杠开头
  type: 'view',   // dictionary(目录)、view(视图组件)、permission(按钮、请求权限)
  show: true,     // 是否显示到菜单
  sort: 1,        // 在菜单中的同级排序
  icon: '',       // 图标
  parentKey: '',  // 父级key，根节点则为空
}

/**
 * 服务端返回的菜单资源，这里配置的数据仅为调试用
 */
const roleResource = [
  {
    key: 't22',
    title: 'test2',
    url: 'views/t2',
    type: 'view',
    show: true,
    sort: 1,
    icon: 'el-icon-thumb',
    parentKey: '',
  },
  {
    key: 'user-center',
    title: '用户中心',
    url: '',
    type: 'dictionary',
    show: true,
    sort: 1,
    icon: 'el-icon-thumb',
    parentKey: '',
  },
  {
    key: 'userlist',
    title: '用户管理',
    url: 'views/Home',
    type: 'view',
    show: true,
    sort: 1,
    icon: 'el-icon-thumb',
    parentKey: 'user-center',
  }
]

/**
 * 动态路由资源，附加到路由中Layout下，roleResource处理后会追加到这里。
 * 本地调试可配置，需要搭配 menuRoutes
 */
function createAsyncRoutes() {
  return [
    {
      meta: { title: 't1页面的视图在这', icon: 'el-icon-s-home', permission: [] },
      path: '/t1',
      name: 't11',
      component: () => import('@/views/t1.vue'),
    }
  ]
}
export let asyncRoutes = []

/**
 * 用于菜单显示的资源，roleResource处理后会追加到这里。
 * 本地调试可配置，需要搭配 asyncRoutes
 */
function createMenuRoutes() {
  return [
    {
      path: '/t1?q=sss',
      meta: { title: 't1页面的视图在这', icon: 'el-icon-s-home', show: true },
    },
  ]
}
export let menuRoutes = []

// 构建route对象
function buildRouteItem(roleItem) {
  let route = {}
  route.name = roleItem.key
  route.path = roleItem.key
  if (roleItem.url) {
    // 注意这里的坑，必须 “@/”开头，作为常量字符，不能放到动态参数里。大概原因是 动态导入需要首先确定路径
    route.component = () => import(`@/${roleItem.url}`)
  }
  route.meta = roleItem
  return route
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

/**
 * 构建路由，根据服务端权限资源，构建菜单树、视图路由
 * @param {*} roleItems 服务端返回的权限资源
 */
export function buildRoutes(roleItems = roleResource) {
  //每次初始化，避免重复登录后数据重复
  menuRoutes = createMenuRoutes()
  asyncRoutes = createAsyncRoutes()
  let map = {}
  let routes = []
  roleItems.forEach(item => {
    let route = buildRouteItem(item)
    routes.push(route)
    //key作为对象Key
    map[route.name] = route
  })
  // 循环：构建树、找出视图组件
  routes.forEach(item => {
    //parent为空的是根节点
    if (!item.meta.parentKey) {
      menuRoutes.push(item)
    }
    else {
      map[item.meta.parentKey].children ??= []
      map[item.meta.parentKey].children.push(item)
    }
    //找出视图组件，用于路由
    if (item.meta.type === 'view') {
      asyncRoutes.push(item)
    }
  })
  // 递归处理一下path，递归父节点的name+自己的name
  buildPath(menuRoutes)
  return asyncRoutes
}
