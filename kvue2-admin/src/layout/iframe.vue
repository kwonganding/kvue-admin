<template>
  <div class="view" style="width: 100%;height: 100%;">
    <iframe style="width: 100%; height: 100%" :src="src" ref="frame" frameborder="no"></iframe>
  </div>
</template>

<!--
这里的iframe不支持keepalive的缓存，因为vue的缓存是缓存虚拟VNode对象，iframe里的东西自然不属于虚拟dom。
实现的思路就是单独管理有iframe的页面，通过v-show来切换，在入口页面处来处理，
有需要的时候再来实现吧
-->

<script>
export default {
  name: 'iframe',
  data() {
    return {
      src: undefined,
      loading: false,
      frameElement: undefined
    }
  },
  created() {
    this.src = this.$route.params.href
  },
}
</script>
