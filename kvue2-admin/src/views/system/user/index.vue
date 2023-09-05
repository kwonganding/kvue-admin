<template>
  <!-- 列表页布局 -->
  <el-container class="list-view-layout" v-loading="loading">
    <!-- 头部区域：操作按钮、搜索 -->
    <el-header height="max-content">
      <ListViewToolbar :form="query" @search="onSearch">
        <!-- 左侧-功能按钮区 -->
        <template #left>
          <el-button type="primary" icon="el-icon-plus" @click="handleEdit()">新增</el-button>

          <el-button
            icon="el-icon-delete"
            title="删除选择项"
            type="warning"
            @click="handleDelete($refs.dataTable?.selection?.map(r=>r.id).join(','))"
            :disabled="$refs.dataTable?.selection.length<1"
          >删除</el-button>
        </template>

        <!-- 固定常用搜索，默认插槽 -->
        <el-form-item label="名称" prop="name">
          <el-input placeholder="用户名或昵称" v-model="query.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="state">
          <el-radio-group v-model="query.state">
            <el-radio-button border label>All</el-radio-button>
            <el-radio-button v-for="e in enumUse.values" :label="e.key" :key="e.key">{{e.text}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 更多高级搜索 -->
        <template #more>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="query.phone" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item prop="gander" label="性别">
            <el-radio-group v-model="query.gander">
              <el-radio-button border label>All</el-radio-button>
              <el-radio-button v-for="e in enumGender.values" :label="e.key" :key="e.key">{{e.text}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="创建日期" prop="createTime">
            <el-date-picker
              v-model="query.createTime"
              type="daterange"
              value-format="timestamp"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:280px"
            ></el-date-picker>
          </el-form-item>
        </template>
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
        <el-table-column label="用户名" min-width="120" prop="name" align="left" show-overflow-tooltip>
          <el-link slot-scope="scope" @click="$refs.detailDrawer.open(scope.row)" type="primary">{{scope.row.name}}</el-link>
        </el-table-column>
        <el-table-column label="昵称" min-width="120" prop="nickname" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="性别" width="90" prop="gender" align="center">
          <template slot-scope="scope">
            <el-tag :type="enumGender[scope.row.gender]?.type">{{ enumGender[scope.row.gender]?.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="电话号码" min-width="180" prop="phone" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="邮箱" min-width="180" prop="email" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="100" prop="state" align="center">
          <template slot-scope="scope">
            <el-tag :type="enumUse[scope.row.state]?.type">{{ enumUse[scope.row.state]?.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160" prop="createTime" align="center" sortable="custom">
          <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" class-name="table-link-btton" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-link @click="handleEdit(scope.row)" type="primary">修改</el-link>
            <el-link @click="handleDelete(scope.row.id)" type="warning">删除</el-link>
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
    <DetailDrawer ref="detailDrawer"></DetailDrawer>
  </el-container>
</template>

<script>

import Pagination from '@/components/Pagination'
import ListViewToolbar from '@/components/ListViewToolbar'
import FormDialog from './form.vue'
import DetailDrawer from './detail.vue'
import { enumUse, enumGender } from '@/model/enums'

import { list } from '@/mixins/crud.js'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'
import { Form } from 'element-ui'

export default {
  name: 'user',
  components: { Pagination, ListViewToolbar, FormDialog, DetailDrawer },
  mixins: [list],

  data() {
    return {
      enumUse,
      enumGender,
      // 搜索条件，分页参数通过混合复用
      query: {
        name: '',
        gander: '',
        phone: '',
        email: '',
        createTime: null, //时间范围数组
        state: null,
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    getList,
    deleteById,
    // 编辑数据（新增、修改）
    handleEdit(row) {
      this.$refs.fromDialog.open(row?.id)
    }
  }
}
</script>

