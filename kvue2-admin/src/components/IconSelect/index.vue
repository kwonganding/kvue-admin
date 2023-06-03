<!-- 图标选择器 -->
<template>
<el-popover placement="bottom" :width="popWidth" trigger="click" :disabled="disabled" ref="popBox">
  <!-- 图标搜索框 -->
  <el-input v-model="searchText" size="mini" clearable suffix-icon="el-icon-search" placeholder="输入class关键词搜索"
    style="padding: 0 5px 5px;"></el-input>
  <!-- 图标列表 -->
  <el-collapse value="1" class="view-scroll icons-wrapper">
    <el-collapse-item title="element-icons" name="1">
      <i v-for="name in elementIcons" class="icon-item" :class="name" :key="name" @click="iconClick(name)"
        :title="name"></i>
    </el-collapse-item>
    <el-collapse-item title="iconfont-icons" name="2">
      <i v-for="name in iconfontIcons" :class="iconfontClass(name)" :key="name" @click="iconClick(iconfontClass(name))"
        class="icon-item" :title="name"></i>
    </el-collapse-item>
  </el-collapse>

  <!-- 宿主，一个文本输入框 -->
  <el-input :value="value" @input="$emit('input', $event)" ref="inputBox" slot="reference" placeholder="点击选择图标"
    :disabled="disabled" v-bind="$attrs">
    <i slot="prepend" :class="value" class="prefix-icon"></i>
  </el-input>

</el-popover>
</template>

<script>
// 图标class资源
import elementIcons from './element-icons'
import iconfontIcons from './iconfont-icons'

export default {
  name: 'IconSelect',
  props: {
    value: {  // 值，通过v-model绑定
      type: String,
      default: 'el-icon-setting'
    },
    disabled: { // 是否禁用，默认fasle
      type: Boolean,
      default: false,
    },
    hideOnSelected:  // 选中后是否隐藏，默认fasle，使用的属性为“hide-on-selected”
      { type: Boolean, default: false }
  },
  data() {
    return {
      searchText: '',
      popWidth: '300',
    }
  },
  computed: {
    elementIcons() {
      return this.searchText ? elementIcons.filter(s => s.indexOf(this.searchText) >= 0) : elementIcons
    },
    iconfontIcons() {
      return this.searchText ? iconfontIcons.filter(s => s.indexOf(this.searchText) >= 0) : iconfontIcons
    }
  },
  mounted() {
    // 监听输入组件的大小，同步修改Pop的宽度
    const observer = new ResizeObserver(this.onResize).observe(this.$refs.inputBox?.$el)
    this.$once('hook:beforeDestroy', () => observer?.disconnect())
  },
  methods: {
    iconfontClass(name) {
      return `iconfont ${name}`
    },
    iconClick(name) {
      this.$emit('input', name)
      this.$refs.popBox.showPopper = !this.hideOnSelected
    },
    onResize() {
      const w = this.$refs.inputBox?.$el.clientWidth
      this.popWidth = w > 300 ? w : 300
    }
  }
}
</script>

<style lang='less' scoped>
.prefix-icon {
  font-size: 18px;
  color: initial;
}

.icons-wrapper {
  min-height: 100px;
  max-height: 360px;

  .icon-item {
    font-size: 20px;
    margin: 5px;
    // iconfont的坑，i默认是行内元素，transform不起作用，改成行内块元素
    display: inline-block;

    &:hover {
      transform: scale(1.6);
      color: var(--theme-hcolor);
    }
  }
}
</style>
