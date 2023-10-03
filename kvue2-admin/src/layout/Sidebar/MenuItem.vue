<template>
  <el-menu-item v-if="!hasChildren" :index="item.nav" style="position: relative;">
    <i :class="item.meta.icon"></i>
    <!-- 名称用title插槽，折叠时才有效 -->
    <span slot="title" style="margin-left:2px">{{ item.meta.title }}</span>
    <span v-show="isActived" class="active-suffix" :style="config.theme"></span>
  </el-menu-item>
  <el-submenu v-else :index="item.nav">
    <template slot="title">
      <i :class="item.meta.icon"></i>
      <span slot="title" style="margin-left:2px">{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="child in children" :item="child" :key="child.meta.title"></MenuItem>
  </el-submenu>
</template>

<script>
import settings from '@/settings'

export default {
  name: 'MenuItem',
  props: ['item'],
  data() {
    return {
      config: settings.userConfig,
    }
  },
  computed: {
    children() {
      return this.item?.children?.filter(s => s.meta.visible)
    },
    hasChildren() {
      return this.item?.children?.length > 0
    },
    isActived() {
      return this.$route.nav == this.item.nav
    }

  },
}
</script>

<style scoped lang="less">
.active-suffix {
  position: absolute;
  left: 1px;
  width: 3px;
  height: 100%;
  border-top: 1px #fff solid;
}
</style>

