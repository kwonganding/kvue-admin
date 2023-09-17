<template>
  <!-- 主内容：树+列表 -->
  <el-container v-loading="loading">
    <!-- 左侧部门树，独立视图 -->
    <el-aside width="210px" class="view aside-view-layout">
      <el-header height="32px">
        <span style="line-height:32px">
          <i class="iconfont icon-cluster"></i> 组织机构树
        </span>
        <span>
          <el-button icon="el-icon-plus" type="text" title="新增"></el-button>
          <el-button icon="el-icon-refresh-left" type="text" v-throttle title="刷新" @click="loadTreeData"></el-button>
        </span>
      </el-header>
      <el-main>
        <div style="line-height:36px">
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
          <p>33333</p>
        </div>
      </el-main>
    </el-aside>

    <!-- 右侧列表区域视图 -->
    <el-container class="view list-view-layout">
      <!-- 头部区域：操作按钮、搜索 -->
      <el-header height="max-content">
        <ListViewToolbar :form="query" @search="doSearch" @onreset="doSearch">
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

          <!-- 更多高级搜索 -->
          <template #more>
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
          <el-table-column label="电话号码" min-width="180" prop="phone" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column label="邮箱" min-width="180" prop="email" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" width="100" prop="state" align="center">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.state"
                :type="enumState[scope.row.state]?.type"
              >{{ enumState[scope.row.state]?.text }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" width="160" prop="createTime" align="center" sortable="custom">
            <template slot-scope="scope">{{ formatTime(scope.row.createTime) }}</template>
          </el-table-column>

          <!-- 操作列，按需固定：fixed="right"-->
          <el-table-column label="操作" class-name="table-link-btton" width="130" align="center">
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
import FormDialog from './formplus.vue'
import DetailDrawer from './detail.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'

import { enumState } from '@/model/enums'

export default {
  name: 'list2',
  components: { Pagination, ListViewToolbar, FormDialog, DetailDrawer },
  mixins: [list],
  data() {
    return {
      enumState,
      left: {  //左侧的-类型
        data: [],
        currentNode: null,
        loading: false,
      },
      // 搜索条件，分页参数通过混合复用
      query: {
        name: undefined,
        createTime: undefined, //时间范围数组
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

    handleDelete(id) {
      this.$message.warning('模板页面，删掉该方法即可')
    }
  }
}
</script>

