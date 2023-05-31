<template>
<div>
  <p>t22222</p>
  <input v-model="permission" />

  <el-button type="primary" v-permission="permission">添加</el-button>

  <el-button type="warning" v-permission="'edit'">修改</el-button>
  <el-button type="danger" v-permission="'delete'">删除</el-button>
  <div>
    <p :class="cc">123</p>

  </div>
  <el-card>
    <IconSelect @hook:mounted="console.log('mountddd')" style="width:400px" clearable></IconSelect>
  </el-card>
  <el-card>
    <TreeSelect :data="menuRoutes" :value="selectValue" clearable
      :options="{ id: 'name', label: (data, node) => data.meta.title, children: 'children' }">
    </TreeSelect>
  </el-card>

  <el-card>
  </el-card>
</div>
</template>

<script>

import IconSelect from '@/components/IconSelect'
import TreeSelect from '@/components/TreeSelect'
import { menuRoutes } from '@/router/routes'

export default {
  name: 't22',
  components: { IconSelect, TreeSelect },
  data() {
    return {
      permission: 'add',
      cc: 'red b',
      console,
      menuRoutes,
      selectValue: '',
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
