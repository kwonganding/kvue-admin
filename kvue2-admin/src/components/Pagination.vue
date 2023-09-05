<!-- // 分页组件,使用示例： -->
<!-- <Pagination :total="total" :size.sync="search.size" :page.sync="search.page" @pagination="loadData"></Pagination> -->
<!-- <Pagination :total="dataList.total" :size.sync="query.pageSize" :page.sync="query.pageIndex" @pagination="loadData" ></Pagination> -->

<template>
  <el-pagination
    style="text-align:right;"
    background
    :total="total"
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :page-sizes="[5, 10, 20, 50, 100]"
    @current-change="pageChanged"
    @size-change="pageSizeChanged"
    layout="total, sizes, prev, pager, next, jumper"
  ></el-pagination>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    //总数
    total: { type: Number, require, default: 0, },
    //页码，外部绑定加修饰符.sync
    size: { type: Number, default: 20, },
    // 当前页码，外部绑定加修饰符.sync
    page: { type: Number, default: 1, }
  },
  computed: {
    currentPage: {
      get() { return this.page },
      set(val) { this.$emit('update:page', val) }
    },
    pageSize: {
      get() { return this.size },
      set(val) { this.$emit('update:size', val) }
    }
  },
  methods: {
    pageSizeChanged(v) {
      // 修改父组件值
      this.$emit('update:size', v)
      // 触发分页事件
      this.$emit('pagination')
    },
    pageChanged(v) {
      // 修改父组件值
      this.$emit('update:page', v)
      // 触发分页事件
      this.$emit('pagination')
    },
  }
}
</script>
