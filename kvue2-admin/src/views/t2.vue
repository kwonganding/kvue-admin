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

    <div class="cards">
      <el-card header="图标选择器" class="item">
        <div style="margin:10px">
          <IconSelect v-model="selectIcon" clearable hide-on-selected></IconSelect>
        </div>
        <div style="margin:10px">
          <IconSelect v-model="selectIcon" style="background-color: red;" disabled></IconSelect>
        </div>
      </el-card>
      <el-card header="树选择器" class="item">
        <TreeSelect
          :data="menuRoutes"
          :value="selectValue"
          clearable
          style="margin:10px"
          :options="{ id: 'name', label: (data) => data.meta.title, children: 'children' }"
        ></TreeSelect>
      </el-card>

      <el-card header="表单" class="item">
        <el-form label-width="90px">
          <el-form-item label="菜单图标：">
            <IconSelect></IconSelect>
          </el-form-item>

          <el-form-item label="菜单图标："></el-form-item>
        </el-form>
      </el-card>

      <el-card class="item"></el-card>
    </div>
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
      selectIcon: 'el-icon-setting'
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

.cards {
  display: flex;
  flex-flow: wrap;

  .item {
    min-width: 200px;
    margin: 20px;
    padding: 0 10px 10px;
    flex: 1 1 400px;
  }
}
</style>
