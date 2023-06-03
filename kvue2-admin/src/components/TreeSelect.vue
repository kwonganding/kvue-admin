<!-- 下拉树形选择器 -->
<template>
<!-- 代理所有属性、事件：v-bind="$attrs" v-on="$listeners" -->
<el-select ref="select" v-model="currentText" @clear="handelClear" class="tree-select" v-bind="$attrs" v-on="$listeners"
  :filter-method="filter" :filterable="filterable">
  <el-option class="tree-wrapper-option view-scroll" :value="currentItem[option.value]"
    :label="currentItem[option.label]">
    <!-- data：数据-->
    <!-- props：数据结构配置 -->
    <!-- node-key：唯一标识字段 -->
    <el-tree ref="tree" :data="data" :node-key="option.value" :props="option" class="tree-select-tree" show-checkbox
      @current-change="handleCurrentChange" :filter-node-method="filterNode" :check-on-click-node="true"
      :highlight-current="true"></el-tree>
  </el-option>
</el-select>
</template>



<script>
export default {
  name: 'TreeSelect',
  props: {
    value: { default: null }, //选中的值
    data: { type: Array },  // 树形结构数据
    onlyLeaf: { type: Boolean, default: true },  //是否只能选择叶子节点
    filterable: { type: Boolean, default: true }, // 是否支持搜索
    //树形数据结构配置
    option: { type: Object, default: () => { return { value: 'id', label: 'name', children: 'children' } } }
  },
  data() {
    return {
      currentItem: {}, //当前的有效选项
      innerValueChange: false, //标记是否内部文件变化
    }
  },
  computed: {
    //当前选中的选项文本
    currentText: {
      get() { return this.currentItem?.[this.option.label] },
      set() { }
    }
  },
  watch: {
    value(nval) {
      //如果是内部文件变化，则不处理，避免循环更新
      // if (this.innerValueChange) {
      //   this.innerValueChange = false
      //   return
      // }
      this.initialize()
    }
  },
  methods: {
    handleCurrentChange(item, node) {
      //如果只能选择叶子节点，当前是非叶子节点时干活！
      if (this.onlyLeaf && !node.isLeaf) {
        //重置选中项
        this.$refs.tree.setCurrentKey(this.value)
        return //不更新选中值
      }
      this.emitValue(item)
    },
    //清除
    handelClear() {
      this.emitValue({})
      this.$refs.tree.setCurrentKey(null)
    },
    //初始化设置当前选中的项
    initialize() {
      let key = this.value
      const node = key ? this.$refs.tree.getNode(key) : null
      this.currentItem = node ? node.data : {}
      this.$refs.tree.setCurrentKey(key)
    },
    // 更新值
    emitValue(item) {
      this.currentItem = item
      this.innerValueChange = true
      this.$emit('input', item[this.option.value])
      // this.$refs.select.blur()
    },
    // 触发节点筛选
    filter(text) {
      this.$refs.tree.filter(text)
    },
    // 执行节点筛选
    filterNode(value, data) {
      console.log(data)
      if (!value) return true
      return data[this.option.label].includes(value)
    }
  }
}
</script>

<style lang='less' scoped>
.tree-select {
  width: 100%;
}

.tree-wrapper-option {
  min-height: 100px;
  height: auto;
  overflow-y: auto;
  background: none;
  line-height: 1;
  font-weight: normal;
  padding: 0;

  &:hover {
    background: none;
  }
}
</style>

<style lang="less">
.tree-select-tree {
  .is-current>.el-tree-node__content {
    font-weight: 600;
    color: var(--theme-hcolor);
  }

  .el-tree-node__content {
    height: 32px;
    margin: 1px;
  }
}
</style>
