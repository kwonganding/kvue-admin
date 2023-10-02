<template>
  <div class="view">
    {{ $route.query.name }}
    <el-input v-model="mes" placeholder></el-input>
  </div>
</template>

<script>
export default {
  name: 'query-view',
  data() {
    return {
      mes: ""
    }
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
</style>
