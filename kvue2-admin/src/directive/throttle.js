// 按钮‘click’事件限流指令，点击后会设置button不可用时间，默认值为2000ms
// 使用示例（注意字符值加引号）：v-throttle

import Vue from "vue"

const throttle = {
  inserted(el, { value }, vnode) {
    const time = value ?? 2000
    el.addEventListener('click', e => {
      el.classList.add('is-disabled')
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
        el.classList.remove('is-disabled')
      }, time)
    })
  },
}

// 注册指令 permission
Vue.directive('throttle', throttle)
