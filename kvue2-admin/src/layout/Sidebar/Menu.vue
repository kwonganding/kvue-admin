<template>
  <el-menu
    router
    class="sidebar-menu scroll"
    :collapse="collapse"
    :default-active="$route.path"
    :active-text-color="config.theme.backgroundColor"
  >
    <MenuItem v-for="item in menuItems" :item="item" :key="item.path"></MenuItem>
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem.vue'
import { menuRoutes } from '@/router/routes'
import settings from '@/settings'

export default {
  name: 'Menu',
  components: {
    MenuItem,
  },
  props: ['collapse'],
  data() {
    return {
      menuItems: [],
      config: settings.userConfig,
    }
  },
  created: function() {
    this.menuItems = Object.freeze(menuRoutes.filter(s => s.meta.visible))
  },
}
</script>

<style lang='less' scoped>
@import url("@/styles/var.less");

.el-menu {
  text-align: left;
  height: 100%;
  overflow-x: hidden;

  &:not(.el-menu--collapse) {
    width: @sidemenu-widht;
  }
}
</style>

<style lang="less">
.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff12;

  span {
    font-weight: bold;
  }
}
</style>
