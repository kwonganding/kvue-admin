<template>
<el-select placeholder="选择图标" v-model="value" v-bind="$attrs" ref="select">
  <i :class="value" slot="prefix" class="prefix-icon"></i>
  <el-option value="" ref="option" class="option view-scroll" :style="{ width: optionWidth }">
    <div @click.stop>
      <el-input v-model="searchText" class="searchText" size="mini" clearable suffix-icon="el-icon-search"
        placeholder="输入关键词搜索"></el-input>
      <el-collapse value="1">
        <el-collapse-item title="element-icons" name="1" @click.stop>
          <i v-for="name in elementIcons" class="icon-item" :class="name" :key="name" @click.stop="iconClick(name)"
            :title="name"></i>
        </el-collapse-item>
        <el-collapse-item title="iconfont-icons" name="2" @click.stop>
          <i v-for="name in iconfontIcons" :class="iconfonClass(name)" :key="name"
            @click.stop="iconClick(iconfonClass(name))" class="icon-item" :title="name"></i>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-option>
</el-select>
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
      optionWidth: '100%'
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
    this.optionWidth = this.$refs.select.$el.clientWidth + 'px'
    // this.$refs.option.$el.scrollIntoView(true)
  },
  methods: {
    iconfonClass(name) {
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
  line-height: 32px;
  margin-left: 4px;
  font-size: 16px;
  color: initial;
}

.option {
  min-height: 100px;
  height: auto;
  padding: 0 5px;
  background: none;
  line-height: 1;
  font-weight: normal;
  white-space: initial;

  &:hover {
    background: none;
  }

  .searchText {
    margin: 0 10px 3px 5px;
    width: calc(100% - 15px);
  }

  .icon-item {
    font-size: 20px;
    margin: 5px;
    // iconfont的坑，i默认是行内元素，transform不起作用，改成行内块元素
    display: inline-block;

    &:hover {
      transform: scale(1.5);
      color: #409EFF;
    }
  }
}
</style>
