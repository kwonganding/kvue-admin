<template>
  <el-menu router class="sidebar-menu view-scroll" :collapse="collapse" :default-active="$route.path">
    <MenuItem v-for="item in menuItems" :item="item" :key="item.path" />
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem.vue'
import { menuRoutes } from '@/router/routes'

export default {
  name: 'Menu',
  components: {
    MenuItem,
  },
  props: ['collapse'],
  data() {
    return {
      menuItems: [],
    }
  },
  created: function() {
    this.menuItems = Object.freeze(menuRoutes.filter(s => s.meta.show))
  },
}
</script>

<style lang='less' scoped>
.el-menu {
  text-align: left;
  height: 100%;
  overflow-x: hidden;
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>

<style>
.sidebar-menu .el-menu-item.is-active {
  font-weight: bold;
  background-color: #409eff12;
}
</style>
