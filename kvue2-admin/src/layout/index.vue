<!-- 框架主页面 -->
<template>
  <el-container style="height:100%">
    <!-- 左侧菜单工具栏 -->
    <Sidebar></Sidebar>

    <!-- 右边：上为header，下为主容器区域 -->
    <el-container direction="vertical">
      <!-- 头部，包括 -->
      <HeaderBar>
        <!-- 标签栏放在这里 -->
        <TagsBar></TagsBar>
      </HeaderBar>

      <!-- 主容器 -->
      <el-container class="main-wrapper view-scroll">
        <transition mode="out-in" :name="config.routerAnimation ? 'fade-transform' : ''">
          <keep-alive :include="cacheNames">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from './Sidebar'
import TagsBar from './TagsBar'
import settings from '@/settings'
import HeaderBar from './Header/HeaderBar.vue'

export default {
  name: 'Layout',
  components: { Sidebar, HeaderBar, TagsBar },
  data: () => {
    return {
      config: settings.userConfig,
    }
  },
  computed: {
    cacheNames() {
      return this.$store.getters.cacheNames
    }
  },
}
</script>

<style lang='less' scoped>
// 主内容区容器
.main-wrapper {
  margin: 7px;
  border: 1px solid #ebeef5;
  padding: 7px 8px;
  height: 100%;
  position: relative;
  overflow: hidden auto;
  flex-flow: column;
}

// 路由切换动画
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
