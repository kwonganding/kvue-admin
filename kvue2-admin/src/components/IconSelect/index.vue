<template>
<el-popover placement="bottom" :width="popWidth" trigger="click">
  <div>
    <el-input v-model="searchText" class="searchText" size="mini" clearable suffix-icon="el-icon-search"
      placeholder="输入关键词搜索"></el-input>

    <el-collapse value="1" class="view-scroll icons-wrapper">
      <el-collapse-item title="element-icons" name="1">
        <i v-for="name in elementIcons" class="icon-item" :class="name" :key="name" @click="iconClick(name)"
          :title="name"></i>
      </el-collapse-item>
      <el-collapse-item title="iconfont-icons" name="2">
        <i v-for="name in iconfontIcons" :class="iconfontClass(name)" :key="name"
          @click="iconClick(iconfontClass(name))" class="icon-item" :title="name"></i>
      </el-collapse-item>
    </el-collapse>
  </div>

  <el-input v-model="value" ref="inputIcon" slot="reference" placeholder="点击选择图标" v-bind="$attrs">
    <template slot="prepend">
      <i :class="value" class="prefix-icon"></i>
    </template>
  </el-input>

</el-popover>
</template>

<script>

import elementIcons from './element-icons'
import iconfontIcons from './iconfont-icons'

export default {
  name: 'IconSelect',
  data() {
    return {
      value: 'el-icon-setting',
      searchText: '',
      popWidth: '100%',
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
    //最少宽度300
    const w = this.$refs.inputIcon.$el.clientWidth
    this.popWidth = w > 300 ? w : 300
  },
  methods: {
    iconfontClass(name) {
      return `iconfont ${name}`
    },
    iconClick(name) {
      this.value = name
    }
  }
}
</script>

<style lang='less' scoped>
.prefix-icon {
  font-size: 18px;
  color: initial;

}

.searchText {
  margin: 0 2px 5px;
  width: calc(100% - 4px);
}



.icons-wrapper {
  min-height: 100px;
  max-height: 500px;

  .icon-item {
    font-size: 20px;
    margin: 5px;
    // iconfont的坑，i默认是行内元素，transform不起作用，改成行内块元素
    display: inline-block;

    &:hover {
      transform: scale(1.5);
      color: var(--theme-hcolor);
    }
  }
}
</style>
