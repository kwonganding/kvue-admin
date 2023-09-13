<template>
  <!-- 主内容：树+列表 -->
  <el-container>
    <!-- 左侧部门树，独立视图 -->
    <el-aside width="210px" class="view view-left aside-tree">
      <el-header height="32px">
        <span style="line-height:32px">
          <i class="iconfont icon-cluster"></i> 组织机构树
        </span>
        <span>
          <el-button
            icon="el-icon-circle-close"
            type="text"
            v-throttle
            title="清除选中"
            @click="onTreeCurrentChange(null)"
            :disabled="!tree.currentNode"
          ></el-button>
          <el-button icon="el-icon-refresh-left" type="text" v-throttle title="刷新" @click="loadTreeData"></el-button>
        </span>
      </el-header>
      <el-main>
        <el-tree
          ref="tree"
          :data="tree.data"
          v-loading="tree.loading"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          @current-change="onTreeCurrentChange"
          :default-expanded-keys="tree.expandKeys"
          :props="{ value: 'id', label: 'name', children: 'children' }"
        ></el-tree>
      </el-main>
    </el-aside>

    <!-- 右侧列表区域视图 -->
    <el-container class="view list-view-layout" v-loading="loading">
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
            <el-tag
              type="success"
              v-show="tree.currentNode"
              closable
              @close="onTreeCurrentChange(null)"
              style="margin:0 10px"
            >{{ tree.currentNode?.name }}</el-tag>
          </template>

          <!-- 固定常用搜索，默认插槽 -->
          <el-form-item prop="name">
            <el-input placeholder="用户名或昵称" v-model="query.name" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item prop="state">
            <el-radio-group v-model="query.state">
              <el-radio-button border :label="null">All</el-radio-button>
              <el-radio-button v-for="e in enumState.values" :label="e.key" :key="e.key">{{e.text}}</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 更多高级搜索 -->
          <template #more>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="query.phone" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item prop="gender" label="性别">
              <el-radio-group v-model="query.gender">
                <el-radio-button border :label="null">All</el-radio-button>
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
            <el-link
              slot-scope="scope"
              @click="$refs.detailDrawer.open(scope.row?.id)"
              type="primary"
            >{{scope.row.name}}</el-link>
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
              <el-tag :type="enumState[scope.row.state]?.type">{{ enumState[scope.row.state]?.text }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" width="160" prop="createTime" align="center" sortable="custom">
            <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
          </el-table-column>

          <!-- 操作列，按需固定：fixed="right"-->
          <el-table-column label="操作" class-name="table-link-btton" width="130" align="center" fixed="right">
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
    </el-container>

    <FormDialog ref="fromDialog" @updated="loadData"></FormDialog>
    <DetailDrawer ref="detailDrawer"></DetailDrawer>
  </el-container>
</template>

<script>
import { list } from '@/mixins/crud.js'
import Pagination from '@/components/Pagination'
import ListViewToolbar from '@/components/ListViewToolbar'
import FormDialog from './form.vue'
import DetailDrawer from './detail.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'
import { getDepartments } from '@/api/department.js'

import { enumState, enumGender } from '@/model/enums'
import { list2Tree, map } from '@/utils/tree'

export default {
  name: 'user',
  components: { Pagination, ListViewToolbar, FormDialog, DetailDrawer },
  mixins: [list],
  data() {
    return {
      enumState,
      enumGender,
      tree: {  //左侧的树-组织机构
        data: [],
        currentNode: null,
        loading: false,
        expandKeys: null,
      },

      // 搜索条件，分页参数通过混合复用
      query: {
        name: '',
        gander: '',
        phone: '',
        email: '',
        createTime: undefined, //时间范围数组
        state: undefined,
      },
    }
  },
  created() {
    this.loadData()
    this.loadTreeData()
  },
  methods: {
    getList,
    deleteById,

    // 编辑数据（新增、修改）
    handleEdit(row) {
      // 传入部门树
      this.$refs.fromDialog.open(row?.id, this.tree.data)
    },
    // 加载树列表数据：组织机构树
    loadTreeData() {
      this.tree.loading = true
      getDepartments().then(res => {
        this.tree.data = list2Tree(res.data)
        // 默认展开一级
        this.tree.expandKeys = this.tree.data.map(s => s.id)
      }).finally(() => this.tree.loading = false)
    },
    // tree选中节点：更新列表数据
    onTreeCurrentChange(item) {
      this.tree.currentNode = item
      // 传入所有子级节点id，因为sqlite不支持递归sql，暂时只能这样实现了
      this.query.departmentIds = map([item], n => n.id)?.join(',')
      // 清除选中
      if (!item) {
        this.$refs.tree.setCurrentKey(null)
      }

      // 触发重新搜索
      this.doSearch()
    },
  }
}
</script>

<style lang="less" scoped>
.aside-tree {
  overflow: initial;
  padding: 5px;
  header {
    display: flex;
    justify-content: space-between;
    padding: 0 1px;
    border-bottom: 1px dashed #0001;

    button {
      margin: 0 2px;
    }
  }

  .el-main {
    padding: 2px 0;
    max-height: calc(100% - 32px);
  }
}
</style>
