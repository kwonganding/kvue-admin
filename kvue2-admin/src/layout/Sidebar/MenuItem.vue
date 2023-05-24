<template>
  <el-menu-item v-if="!hasChildren" :index="item.path">
    <i :class="item.meta.icon"></i>
    <!-- 名称用title插槽，折叠时才有效 -->
    <span slot="title">{{item.meta.title}}</span>
  </el-menu-item>
  <el-submenu v-else :index="item.path">
    <template slot="title">
      <i :class="item.meta.icon"></i>
      <span slot="title">{{item.meta.title}}</span>
    </template>
    <MenuItem v-for="child in children" :item="child" :key="child.meta.title"></MenuItem>
  </el-submenu>
</template>

<script>
export default {
  name: 'MenuItem',
  props: ['item'],
  computed: {
    children() {
      return this.item?.children?.filter(s => s.meta.show)
    },
    hasChildren() {
      return this.item?.children?.length > 0
    },
  },
}
</script>

