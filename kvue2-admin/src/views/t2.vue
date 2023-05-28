<template>
<div>
  <p>t22222</p>
  <input v-model="permission" />

  <el-button type="primary" v-permission="permission">添加</el-button>

  <el-button type="warning" v-permission="'edit'">修改</el-button>
  <el-button type="danger" v-permission="'delete'">删除</el-button>
  <div>
    <p :class="cc">123</p>
    <IconSelect></IconSelect>
  </div>
</div>
</template>

<script>

import IconSelect from '@/components/IconSelect'

export default {
  name: 't22',
  components: { IconSelect },
  data() {
    return {
      permission: 'add',
      cc: 'red b'
    }
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
.red {
  color: red;
}

.b {
  text-decoration: line-through;
}
</style>
