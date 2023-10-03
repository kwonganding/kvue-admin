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
          <el-input placeholder="标题关键词" v-model="query.name" maxlength="30"></el-input>
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
        :default-sort="{prop: 'orderNum', order: 'ascending'}"
        height="100%"
      >
        <el-table-column label="标题" min-width="120" prop="title" align="left" show-overflow-tooltip>
          <i slot-scope="scope" :class="scope.row.icon">&nbsp;{{ scope.row.title }}</i>
        </el-table-column>
        <el-table-column label="编码" min-width="80" prop="name" align="left"></el-table-column>

        <el-table-column label="组件资源" min-width="160" prop="view" align="left" show-overflow-tooltip></el-table-column>

        <el-table-column label="排序号" width="70" prop="orderNum" align="center"></el-table-column>
        <el-table-column label="资源类型" width="90" prop="type" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.type"
              effect="dark"
              :type="enumPermission[scope.row.type]?.type"
            >{{ enumPermission[scope.row.type]?.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="80" prop="visible" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.visible?'success':'warning'" effect="plain">{{ scope.row.visible?'显示':'隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否缓存" width="80" prop="cache" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.cache?'success':'warning'" effect="plain">{{ scope.row.cache?'是':'否' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="70" prop="state" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.state"
              :type="enumState[scope.row.state]?.type"
            >{{ enumState[scope.row.state]?.text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="156" prop="createTime" align="center">
          <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>

        <!-- 操作列，按需固定：fixed="right"-->
        <el-table-column label="操作" class-name="table-link-btton" width="170" align="center" fixed="right">
          <template slot-scope="scope">
            <el-link
              @click="handleAdd(scope.row)"
              v-if="scope.row.type !=='button'"
              type="primary"
              icon="el-icon-plus"
            >新增</el-link>
            <el-link @click="handleEdit(scope.row)" type="primary" icon="el-icon-edit">修改</el-link>
            <el-link @click="handleDelete(scope.row)" type="warning" icon="el-icon-delete" v-permission="'delete'">删除</el-link>
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

import { getList, getById, saveOrUpdate, deleteById } from '@/api/permission.js'

import { enumState, enumPermission } from '@/model/enums'
import { list2Tree } from '@/utils/tree'

export default {
  name: 'permission',
  components: { ListViewToolbar, FormDialog },
  mixins: [list],
  data() {
    return {
      enumState, enumPermission,
      isExpansion: true, // 展开表格树
      // 搜索条件，分页参数通过混合复用
      query: {
        name: undefined,
        state: undefined,
        orderBy: 'orderNum',
        pageIndex: undefined,
        pageSize: undefined,
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
      this.$refs.fromDialog.open(null, prow)
    }
  }
}
</script>

