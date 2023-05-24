/**
 * 本地存储，暂时不用了
 */

import setting from '@/settings'
import store from '@/store'

/**
 * sessionStorage保存store的Key
 */
const KEY_STORE = setting.title + '_VSTORE'

/**
 * 本地（sessionStorage）保存store数据，避免刷新的时丢失
 */
export function saveAndLoadStore() {
  //刷新前保存
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(KEY_STORE, JSON.stringify(store.state))
  })
  try {
    const vstore = sessionStorage.getItem(KEY_STORE)
    if (vstore) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(vstore)))
      // 过河拆桥
      sessionStorage.removeItem(KEY_STORE)
    }
  }
  catch (err) {
    console.log(err)
  }
}
