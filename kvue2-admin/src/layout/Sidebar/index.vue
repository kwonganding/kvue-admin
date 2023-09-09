<template>
  <el-aside width="auto" class="sidebar">
    <!-- logo -->
    <div class="logo" :style="config.theme">
      <img src="@/imgs/logo.png" alt="logo" />
      <h1 :class="{ collapse: config.menuCollapse }">{{ title }}</h1>
    </div>

    <!-- 菜单 -->
    <Menu :collapse="config.menuCollapse" class="sidebar-menu" style="border-right:initial"></Menu>

    <!-- 底部收缩按钮 -->
    <el-button
      class="collapse-button"
      type="text"
      :icon="config.menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
      v-on:click="config.menuCollapse = !config.menuCollapse"
      title="展开/收起侧边栏"
    ></el-button>
  </el-aside>
</template>

<script>
import settings from '@/settings'
import Menu from './Menu.vue'

export default {
  components: { Menu },
  data() {
    return {
      title: settings.title,
      config: settings.userConfig
    }
  },
}
</script>

<style lang='less' scoped>
@import url("@/styles/var.less");

// 布局样式
.sidebar {
  display: flex;
  flex-flow: column;
  position: relative;

  .sidebar-menu {
    height: 100%;
    // 给底部按钮一点空间
    padding-bottom: 32px;
  }

  .collapse-button {
    width: 100%;
    font-size: 18px;
    // 浮在菜单上，主要是为了动画一致（共用一条右侧外框线）
    position: absolute;
    bottom: 0px;
    background-color: #fffe;
    &:hover {
      background-color: #0001;
    }
  }
}

// logo样式
.logo {
  height: @header-height;
  line-height: @header-height;
  padding: 0 8px;

  img {
    vertical-align: middle;
    height: 80%;
    margin-right: 2px;
    z-index: 2;
  }

  h1 {
    display: inline-block;
    vertical-align: middle;
    font-size: 1.4em;
    margin: 0px;
    margin-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    // 动画必须设置初始值
    width: @sidemenu-widht - @header-height - 15;
    opacity: 1;
    transition: all 0.3s;
    z-index: 1;

    &.collapse {
      opacity: 0;
      width: 0;
      transform: translateX(-50%);
    }
  }
}
</style>
