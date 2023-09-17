<template>
  <!-- 主内容：树+列表 -->
  <el-container>
    <!-- 左侧部门树，独立视图 -->
    <el-aside width="300px" class="view aside-view-layout">
      <el-header height="none">
        <span>
          <i class="el-icon-guide"></i> 字典类型
        </span>
        <span>
          <el-button icon="el-icon-plus" type="text" title="新增" @click="handleEdit()"></el-button>
          <el-button icon="el-icon-edit" type="text" title="修改" @click="handleEdit(currentNode)"></el-button>
          <el-button icon="el-icon-delete" type="text" title="删除" @click="handleDelete(currentNode)"></el-button>
          <el-button @click="loadData" icon="el-icon-refresh-left" type="text" v-throttle title="刷新"></el-button>
        </span>
      </el-header>
      <el-main>
        <ul v-loading="loading">
          <li
            v-for="item in dataList"
            :class="{active:currentNode===item}"
            :key="item.id"
            @click="onCurrentChange(item)"
          >
            <i :class="item.isTree?'iconfont icon-sisternode':'iconfont icon-unorderedlist'" />
            {{item.name}} （{{item.type}}）
          </li>
        </ul>
      </el-main>
    </el-aside>

    <!-- 右侧列表区域视图 -->
    <DictData :dict="currentNode"></DictData>

    <FormDialog ref="fromDialog" @updated="loadData"></FormDialog>
  </el-container>
</template>

<script>
import { list } from '@/mixins/crud.js'
import FormDialog from './form-dict.vue'
import DictData from './dict-data.vue'

import { getList, deleteById } from '@/api/dict.js'

export default {
  name: 'dict',
  components: { FormDialog, DictData },
  mixins: [list],
  data() {
    return {
      dataList: [],
      currentNode: null,

      // 搜索条件，分页参数通过混合复用
      query: {
        pageIndex: undefined,
        pageSize: undefined,
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    getList,
    deleteById,

    afterLoadData() {
      // 默认选中第一个，或者保持上一个引用对象
      let snode = null
      if (this.dataList) {
        snode = this.dataList.filter(r => r.id === this.currentNode?.id)?.[0]
        snode ??= this.dataList[0]
      }
      this.onCurrentChange(snode)
    },

    // tree选中节点：更新列表数据
    onCurrentChange(item) {
      this.currentNode = item
    },
  }
}
</script>

<style lang="less" scoped>
.aside-view-layout {
  ul {
    margin: 5px 1px;
    li {
      padding: 8px 5px;
      cursor: pointer;
      background: #f8f8f8;
      margin-bottom: 5px;
    }
    li.active {
      background: var(--theme-hcolor);
      color: var(--theme-color);
      &::after {
        content: "〉";
        float: right;
      }
    }
  }
}
</style>
