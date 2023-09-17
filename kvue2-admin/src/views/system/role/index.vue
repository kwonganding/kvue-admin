<template>
  <!-- 主内容-列表 -->
  <el-container class="list-view-layout view" v-loading="loading">
    <!-- 头部区域：操作按钮、搜索 -->
    <el-header height="max-content">
      <ListViewToolbar :form="query" @on-search="doSearch" @on-reset="doSearch">
        <!-- 左侧-功能按钮区 -->
        <template #left>
          <el-button type="primary" icon="el-icon-plus" @click="handleEdit()">新增</el-button>
          <el-button
            icon="el-icon-delete"
            type="warning"
            @click="handleDelete()"
            :disabled="$refs.dataTable?.selection.length<1"
          >删除</el-button>
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
        :data="dataList.list"
        row-key="id"
        border
        stripe
        height="100%"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="ID" width="80" prop="id" align="center"></el-table-column>
        <el-table-column label="名称" min-width="120" prop="name" align="left" show-overflow-tooltip></el-table-column>

        <el-table-column label="状态" width="160" prop="state" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.state"
              :type="enumState[scope.row.state]?.type"
            >{{ enumState[scope.row.state]?.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="200" prop="createTime" align="center" sortable="custom">
          <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>

        <!-- 操作列，按需固定：fixed="right"-->
        <el-table-column label="操作" class-name="table-link-btton" width="190" align="center">
          <template slot-scope="scope">
            <el-link @click="handleEdit(scope.row)" type="primary" icon="el-icon-edit">修改</el-link>
            <el-link @click="handleDelete(scope.row.id)" type="warning" icon="el-icon-delete">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 底部区域-分页 -->
    <el-footer height="auto">
      <Pagination
        :total="dataList.total"
        :size.sync="query.pageSize"
        :page.sync="query.pageIndex"
        @pagination="loadData"
      ></Pagination>
    </el-footer>

    <FormDialog ref="fromDialog" @updated="loadData"></FormDialog>
  </el-container>
</template>

<script>
import { list } from '@/mixins/crud.js'
import Pagination from '@/components/Pagination'
import ListViewToolbar from '@/components/ListViewToolbar'
import FormDialog from './form.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/role.js'

import { enumState } from '@/model/enums'

export default {
  name: 'role',
  components: { Pagination, ListViewToolbar, FormDialog },
  mixins: [list],
  data() {
    return {
      enumState,
      // 搜索条件，分页参数通过混合复用
      query: {
        name: undefined,
        state: undefined,
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    getList,
    deleteById,
  }
}
</script>

