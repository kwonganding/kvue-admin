<template>
<el-header class="header" :style="config.theme">
  <div class="slot">
    <!-- 左侧插槽，用来放标签栏吧 -->
    <slot></slot>
  </div>
  <!-- 右侧工具按钮 -->
  <i class="el-icon-search header-button" title="搜索"></i>

  <i class="el-icon-message-solid header-button" title="系统通知，啥也不是！" style="padding:0 4px">
    <sup class="el-badge__content hbadge">12</sup>
  </i>
  <i class="el-icon-setting header-button" v-on:click="$refs.settingBox.show()" title="系统设置"></i>
  <SettingBox ref="settingBox"></SettingBox>

  <el-dropdown class="header-userbox" @command="handleCommand">
    <span>
      <img :src="baseURL + $store.getters.userInfo.avatar" alt="头像" />
      [ {{ $store.getters.userInfo.name }} ]
      <i class="el-icon-arrow-down el-icon--right" style="font-size:12px"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="about">
        <i class="el-icon-info"></i>关于
      </el-dropdown-item>
      <el-dropdown-item command="user">
        <i class="el-icon-user-solid"></i>个人中心
      </el-dropdown-item>
      <!-- <el-divider></el-divider> -->
      <el-dropdown-item command="logout" divided icon="el-icon-circle-close">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</el-header>
</template>

<script>

import { baseURL } from '@/utils/request'
import SettingBox from './SettingBox'
import settings from '@/settings'

export default {
  components: { SettingBox },
  data() {
    return {
      baseURL,
      config: settings.userConfig
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.$confirm.warning("确定要退出登录吗？").then(() => {
            //清除token、保存的标签
            this.$store.dispatch('user/logout')
            this.$router.push('/login')
          }).catch(() => { })
          break
        case 'about':
          this.$router.push('/doc')
          break
        case 'user':
          this.$router.push('/user')
          break
      }
    },
  }
}
</script>

<style lang='less' scoped>
@import url("@/styles/var.less");

// 布局
.header {
  height: @header-height !important;
  line-height: @header-height;
  padding: 0;
  display: flex;

  .slot {
    flex: 1;
    overflow: hidden;
    margin: 0 10px;
  }
}

// 用户信息、头像
.header-userbox {
  color: inherit;
  margin: 0 10px;
  cursor: pointer;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    vertical-align: middle;
  }
}

// 按钮样式
.header-button {
  height: 100%;
  opacity: 0.9;
  padding: 0 10px;
  cursor: pointer;
  font-size: 18px;
  line-height: inherit;

  // 数量标签
  .hbadge {
    position: relative;
    left: -2px;
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
  }

  &:hover {
    background: #fff7;
    opacity: 1;
  }
}
</style>
