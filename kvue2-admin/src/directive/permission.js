// 按钮权限处理指令
// 使用示例（注意字符值加引号）：v-permission="'add'"

import Vue from "vue"

function checkPermission(el, value, vnode) {
  if (!value) return
  // 获取当前页面路由的权限配置
  const permissions = vnode.componentInstance?.$root?.$route?.meta?.permissions
  if (!permissions) return
  if (!permissions.includes(value)) {
    el.style.display = 'none'
  }
  else {
    el.style.display = ''
  }
}

const permission = {
  inserted(el, { value }, vnode) {
    checkPermission(el, value, vnode)
  },
  update(el, { value }, vnode) {
    checkPermission(el, value, vnode)
  }
}

// 注册指令 permission
Vue.directive('permission', permission)
