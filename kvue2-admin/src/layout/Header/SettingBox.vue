<template>
  <el-drawer title="用户配置" :visible.sync="visible" size="320px" :modal="false" class="drawer-box" style="line-height: initial;">
    <!-- 主题 -->
    <dl class="dl-blueline">
      <dt>主题</dt>
      <dd>
        <ul class="teama-box" @click="handleThemaClick($event)">
          <li v-for="t in themes" :style="t" :key="t.name" :class="t.name == config.theme.name ? 'active' : ''">
            {{ t.name
            }}
          </li>
        </ul>
      </dd>

      <dt>页面切换动画</dt>
      <dd>
        <el-switch v-model="config.routerAnimation" class="config-box" active-text="启用"></el-switch>
      </dd>

      <dt>收起侧边栏</dt>
      <dd>
        <el-switch v-model="config.menuCollapse" class="config-box" active-text="启用"></el-switch>
      </dd>
    </dl>
  </el-drawer>
</template>

<script>

import settings from '@/settings'

export default {
  name: 'SettingBox',
  data() {
    return {
      visible: false,
      config: settings.userConfig,
      themes: Object.freeze(settings.themes)
    }
  },
  created() {
    //监听配置变更，持久化存储到本地
    this.$watch('config', () => {
      settings.save()
    }, { deep: true })
  },
  methods: {
    show() {
      this.visible = true
    },
    //点击选中
    handleThemaClick(event) {
      if (event.target.tagName !== 'LI')
        return
      const name = event.target.innerText
      this.config.theme = this.themes.filter(s => s.name == name)[0]
    }
  }
}
</script>

<style lang='less' scoped>
.teama-box {
  display: flex;
  flex-flow: wrap;
  list-style-type: none;

  li {
    display: inline-block;
    margin: 5px 15px 5px 0;
    padding: 4px 12px;
    border-radius: 2px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &::before {
      content: "☐";
      font-size: 1.1em;
      margin-right: 3px;
    }

    &.active::before {
      content: "☑";
    }
  }
}
</style>

<style lang='less'>
@import url("@/styles/var.less");

.drawer-box .el-drawer__header {
  height: @header-height !important;
}
</style>
