//用户的全局配置

/**
 * 保存用户配置userConfig到localStorage的KEY
 */
const KEY_USECONFIG = "STORAGE_KEY_USECONFIG"

module.exports = {
  /**
   * 系统名称，显示在浏览器页签上
   */
  title: 'XX管理系统',

  /**
   * 获取页面显示名称，系统名称+页面视图名称组合
   * @param {*} viewName 页面视图名称
   */
  getPageTitle: function(viewName) {
    if (viewName) {
      return `${viewName}-${this.title}`
    }
    return this.title
  },

  /**
   * 主题样式，就标题和菜单
   */
  themes: [
    { name: "靛青", backgroundColor: '#177CB0', color: '#FFF' },
    { name: "橘黄", backgroundColor: '#FF8936', color: '#FFF' },
    { name: "酱紫", backgroundColor: '#d0378d', color: '#FFF' },
    { name: "天蓝", backgroundColor: '#42B9F5', color: '#FFE' },
    { name: "玄青", backgroundColor: '#3D3B4F', color: '#EEE' },
    { name: "葱青", backgroundColor: 'rgb(13 165 122)', color: '#EEE' },
  ],

  /**
   * 用户配置，用户自定义配置后本地存储
   */
  userConfig: {
    // 路由动画
    routerAnimation: true,
    // 系统菜单收起状态
    menuCollapse: false,
    // 语言
    language: 'zh',
    // 主题
    theme: { name: "靛青", backgroundColor: '#177CB0', color: '#FFF' },
  },

  /**
   * 从本地localStorage加载
   */
  load: function() {
    const jstr = localStorage.getItem(KEY_USECONFIG)
    if (!jstr) return
    const vconfig = JSON.parse(jstr)
    if (vconfig)
      this.userConfig = vconfig
  },

  /**
   * 保存到本地localStorage
   */
  save: function() {
    localStorage.setItem(KEY_USECONFIG, JSON.stringify(this.userConfig))
  }
}
