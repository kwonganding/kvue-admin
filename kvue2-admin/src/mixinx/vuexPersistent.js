/** vuex的持久化 */
export const mixin_store_persistent = {
  created: function() {
    //持久化store，避免刷新后的状态丢失
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem('vstore', JSON.stringify(this.$store.state))
    })
    try {
      const vstore = sessionStorage.getItem('vstore')
      if (vstore)
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(vstore)))
    }
    catch (ex) {
      console.log(ex)
    }
  }
}
