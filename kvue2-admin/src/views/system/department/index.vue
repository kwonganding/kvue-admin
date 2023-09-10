<template>
  <!-- 主内容-列表 -->
  <el-container class="list-view-layout view" v-loading="loading">
    <!-- 头部区域：操作按钮、搜索 -->
    <el-header height="max-content">
      <ListViewToolbar :form="query" @on-search="doSearch" @on-reset="doSearch">
        <!-- 左侧-功能按钮区 -->
        <template #left>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新增</el-button>
          <el-button icon="el-icon-sort" type="info" @click="expandTreeTable">展开/收缩</el-button>
        </template>

        <!-- 固定常用搜索，默认插槽 -->
        <el-form-item prop="name">
          <el-input placeholder="名称关键词" v-model="query.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="state">
          <el-radio-group v-model="query.state">
            <el-radio-button border :label="null">All</el-radio-button>
            <el-radio-button v-for="e in enumState.values" :label="e.key" :key="e.key">{{e.text}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </ListViewToolbar>
    </el-header>

    <!-- 内容-列表区域，100%填充区域 -->
    <el-main>
      <el-table
        ref="dataTable"
        :data="treeData"
        row-key="id"
        border
        stripe
        :default-expand-all="isExpansion"
        @sort-change="handleSortChange"
        height="100%"
      >
        <!-- <el-table-column label="ID" width="200" prop="id" align="left"></el-table-column> -->
        <el-table-column label="名称" min-width="150" prop="name" align="left" show-overflow-tooltip></el-table-column>

        <el-table-column label="排序号" width="100" prop="orderNum" align="center" sortable="custom"></el-table-column>
        <el-table-column label="管理员" width="140" prop="manager" align="left"></el-table-column>
        <el-table-column label="备注" min-width="180" prop="remark" align="left" show-overflow-tooltip></el-table-column>

        <el-table-column label="状态" width="100" prop="state" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.state"
              :type="enumState[scope.row.state]?.type"
            >{{ enumState[scope.row.state]?.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="180" prop="createTime" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>

        <!-- 操作列，按需固定：fixed="right"-->
        <el-table-column label="操作" class-name="table-link-btton" width="200" align="center">
          <template slot-scope="scope">
            <el-link @click="handleAdd(scope.row)" type="primary" icon="el-icon-plus">新增</el-link>
            <el-link @click="handleEdit(scope.row)" type="primary" icon="el-icon-edit">修改</el-link>
            <el-link @click="handleDelete(scope.row.id)" type="warning" icon="el-icon-delete">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <FormDialog ref="fromDialog" @updated="loadData"></FormDialog>
  </el-container>
</template>

<script>
import { list } from '@/mixins/crud.js'
import ListViewToolbar from '@/components/ListViewToolbar'
import FormDialog from './form.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/department.js'

import { enumState } from '@/model/enums'
import { list2Tree } from '@/utils/tree'

export default {
  name: 'department',
  components: { ListViewToolbar, FormDialog },
  mixins: [list],
  data() {
    return {
      enumState,
      isExpansion: true, // 展开表格树
      // 搜索条件，分页参数通过混合复用
      query: {
        name: '',
        state: undefined,
      },
      // 注意：部门数据没有分页
      dataList: [],
      treeData: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    getList,
    deleteById,

    afterLoadData() {
      this.treeData = list2Tree(this.dataList)
    },
    // 展开收缩
    expandTreeTable() {
      this.isExpansion = !this.isExpansion
      // 只处理第一级
      const list = this.dataList.filter(s => !s.pid)
      list.forEach(item => {
        this.$refs.dataTable.toggleRowExpansion(item, this.isExpansion)
      })
    },

    // 新增，指定父级
    handleAdd(prow) {
      const pid = prow?.id
      this.$refs.fromDialog.open(null, pid)
    }
  }
}
</script>

