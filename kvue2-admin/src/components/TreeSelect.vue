<!-- 下拉树形选择器 -->
<!-- 使用示例 <TreeSelect :data="data" v-model="value" ></TreeSelect> -->
<template>
  <!-- 代理所有属性、事件：v-bind="$attrs" v-on="$listeners" -->
  <el-select
    ref="select"
    v-model="currentText"
    @clear="handelClear"
    @visible-change="visibleChanged"
    class="tree-select"
    v-bind="$attrs"
    v-on="$listeners"
    :filter-method="filter"
    :filterable="filterable"
  >
    <el-option class="tree-option view-scroll" :value="selectedItem?.[option.value]" :label="selectedItem?.[option.label]">
      <!-- data：数据-->
      <!-- props：数据结构配置 -->
      <!-- node-key：唯一标识字段 -->
      <el-tree
        ref="tree"
        :data="data"
        :node-key="option.value"
        :props="option"
        class="tree-select-innertree"
        @current-change="handleCurrentChange"
        :filter-node-method="filterNode"
        :highlight-current="true"
        check-on-click-node
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    value: { default: null }, //选中的值
    data: { type: Array },    // 树形结构数据
    onlyLeaf: { type: Boolean, default: true },  //是否只能选择叶子节点，使用属性为“only-leaf”
    filterable: { type: Boolean, default: false }, // 是否支持搜索
    hideOnSelected:  // 选中后是否隐藏，默认 true，使用的属性为 “hide-on-selected”
      { type: Boolean, default: true },
    //树形数据结构配置
    option: { type: Object, default: () => { return { value: 'id', label: 'name', children: 'children' } } }
  },
  data() {
    return {
      selectedItem: {}, //当前被选中的项
    }
  },
  computed: {
    //当前选中的选项文本
    currentText: {
      get() { return this.selectedItem?.[this.option.label] },
      set() { }
    },
  },
  watch: {
    value(nval) {
      this.selectedItem = nval ? this.$refs.tree?.getNode(nval)?.data ?? null : null
      this.$refs.tree.setCurrentKey(nval)
    }
  },
  methods: {
    handleCurrentChange(data, node) {
      //如果只能选择叶子节点，或者节点不可用，则重置
      if ((this.onlyLeaf && !node.isLeaf) || node.disabled) {
        //重置选中项
        this.$refs.tree.setCurrentKey(this.value)
        return
      }
      this.emitValue(data)
    },
    //清除
    handelClear() {
      this.emitValue(null)
      this.$refs.tree.setCurrentKey(null)
    },
    // 下拉框显示状态变化事件
    visibleChanged(visible) {
      // 手动清除tree的筛选状态
      this.$refs.tree.filter(null)
    },
    // 更新值
    emitValue(data) {
      this.selectedItem = data
      this.$emit('input', data?.[this.option.value])
      if (this.hideOnSelected)
        this.$refs.select.blur()
    },
    // 触发筛选
    filter(text) {
      this.$refs.tree.filter(text)
    },
    // 执行节点筛选
    filterNode(value, data) {
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

// option容器
.tree-option {
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
.tree-select-innertree {
  // 高亮选中状态
  .is-current > .el-tree-node__content {
    font-weight: 600;
    color: var(--theme-hcolor);
  }

  // 禁用状态
  [aria-disabled="true"] .el-tree-node__content {
    color: #c0c4cc;
    cursor: not-allowed;
  }

  .el-tree-node__content {
    height: 32px;
    margin: 1px;
  }
}
</style>
