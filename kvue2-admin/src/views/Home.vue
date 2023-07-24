<template>
  <p style="font-size:20px; text-align:center; margin-top:40px">欢迎进入 {{ title }}</p>
</template>

<script>
import defaultSetting from '@/settings'
export default {
  name: 'home',
  computed: {
    title() {
      return defaultSetting.title
    }
  },
}
</script>

<style lang='less' scoped>
</style>
