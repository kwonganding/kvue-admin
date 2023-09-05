<template>
  <!-- 列表页布局 -->
  <el-container class="list-view-layout">
    <!-- 头部区域：操作按钮、搜索 -->
    <el-header>
      Header
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
    </el-header>

    <!-- 内容-列表区域，100%填充区域 -->
    <el-main>
      <el-table :data="dataList.list" ref="listTable" row-key="id" border stripe v-loading="loading">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="ID" width="*" prop="id" align="center"></el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" class-name="table-link-btton" width="120px" align="center">
          <template slot-scope="scope">
            <el-link @click="$refs.itemDialogPlus.show(scope.row)" type="primary">修改</el-link>
            <el-link @click="handleDelet(scope.row)" type="warning">删除</el-link>
            <!-- <el-dropdown>
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>重置密码</el-dropdown-item>
                <el-dropdown-item>重置密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 底部区域-分页 -->
    <el-footer>
      <Pagination></Pagination>
    </el-footer>
  </el-container>
</template>

<script>

import Pagination from '@/components/Pagination'

export default {
  name: 'user',
  components: { Pagination },
  data() {
    return {
      list: [{ id: 1 }]
    }
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.list.push({ id: i })
    }
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
</style>
