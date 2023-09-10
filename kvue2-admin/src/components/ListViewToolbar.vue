<!-- crud列表的工具栏组件，主要作用是布局，包括操作按钮、搜索、更多高级搜索 -->

<template>
  <el-form ref="queryForm" inline class="list-view-toolbar" :model="form">
    <!-- 左侧-功能按钮区 -->
    <div class="left">
      <!-- left插值，放置功能按钮 -->
      <slot name="left"></slot>
    </div>

    <!-- 右侧-常规搜索+搜索按钮 -->
    <div class="right">
      <!-- 默认插槽，放置常规搜索内容 -->
      <slot></slot>
      <!-- 搜索操作按钮 -->
      <el-button icon="el-icon-search" type="primary" @click="doSearch()" v-throttle>查询</el-button>
      <el-button icon="el-icon-refresh-left" @click="resetForm()" v-throttle>重置</el-button>
      <el-button
        title="更多查询条件"
        type="text"
        @click="showMore=!showMore"
        :icon="showMore?'el-icon-arrow-up':'el-icon-arrow-down'"
        v-if="hasMore"
      ></el-button>
    </div>

    <!-- more插槽，高级搜索区 -->
    <div class="more" ref="more" v-show="showMore">
      <slot name="more"></slot>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'ListViewToolbar',
  props: {
    form: { require: true }  // 表单数据（查询）对象，主要作用是实现form表单额重置
  },
  data() {
    return {
      showMore: false,  // 是否显示更多的内容
      hasMore: true,    // 是否有更多，判断元素，如果没有设置更多的插槽内容，则不显示更多按钮
    }
  },
  mounted() {
    this.hasMore = this.$refs.more?.hasChildNodes()
  },
  methods: {
    resetForm() {
      this.$refs.queryForm.resetFields()
      // 触发查询事件
      this.$emit('on-reset')
    },
    doSearch() {
      // 触发查询事件
      this.$emit('on-search')
    }
  }
}
</script>

<style lang='less'>
.list-view-toolbar {
  display: flex;
  flex-flow: wrap;
  align-items: center;

  .more {
    flex: 1 1 100%;
    display: flex;
    flex-flow: wrap;
    justify-content: flex-end;
    align-items: center;
    .el-form-item {
      margin: 8px 6px 5px;
    }
  }
  .left {
    width: max-content;
    flex: 0 0 content;
    display: flex;
    align-items: center;
  }
  .right {
    margin-left: 15px;
    flex: 1 1;
    display: flex;
    flex-flow: wrap;
    justify-content: flex-end;
    align-items: center;
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
</style>
