<template>
  <el-container class="view list-view-layout">
    <el-form label-width="120px" style="width:600px" label-position="left">
      <el-row>动态路由，路由路径：dynamic-path/:id</el-row>
      <br />
      <el-form-item label="当前路由参数id">{{ $route.params.id }}</el-form-item>
      <el-form-item label="参数id" required>
        <el-input v-model="id" placeholder>
          <span slot="prepend">/dev/dynamic-path/</span>
        </el-input>
      </el-form-item>

      <el-form-item label>
        <el-button type="primary" @click="$router.push('/dev/dynamic-path/' + id)">打开动态路由页面</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<!-- 动态路由路径的测试页面 -->
<!-- dynamic-path/:id -->

<script>
export default {
  name: 'dynamic-path',
  data() {
    return {
      mes: "",
      id: undefined,
    }
  },
  created() {
    this.id = this.$route.params.id + 1
  }
}
</script>

<style lang='less' scoped>
</style>
