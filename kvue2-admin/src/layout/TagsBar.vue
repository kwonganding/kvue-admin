<template>
  <div class="tagsbar-wrapper">
    <router-link
      class="item"
      v-for="r in cacheRoutes"
      :to="r.path"
      :key="r.path"
      :class="isActive(r) ? 'active' : ''"
      @contextmenu.prevent.native="showMenu(r, $event)"
    >
      <i :class="r.meta.icon" class="icon"></i>
      <span class="title ellipsis">{{ r.meta.title ?? r.name }}</span>
      <i class="el-icon-close close" v-if="!isAffix(r)" @click.prevent.stop="handleClose(r)"></i>
    </router-link>

    <!-- 页签按钮的右键菜单 -->
    <el-card
      class="context-menu"
      v-show="tagMenu.visible"
      :style="{ left: tagMenu.left + 'px', top: tagMenu.top + 'px' }"
    >
      <ul>
        <li @click="refresh(selectedTag)" v-show="isActive(selectedTag)">
          <i class="el-icon-refresh"></i> 刷新
        </li>
        <li @click="handleClose()" v-show="!isAffix(selectedTag)">
          <i class="el-icon-close"></i> 关闭
        </li>
        <li @click="handleCloseOther()">
          <i class="el-icon-circle-close"></i> 关闭其他
        </li>
        <li @click="handleCloseAll">
          <i class="el-icon-error"></i> 关闭所有
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>

import { listRoutes } from '@/router/routes'

export default {
  name: "TagsBar",
  data() {
    return {
      tagMenu: { visible: false, top: 0, left: 0 }, //右键菜单
      selectedTag: {},
    }
  },
  mounted() {
    //初始化固定标签，固定首页
    this.initialAffix()
    //添加当前标签
    this.addTag()
  },
  computed: {
    cacheRoutes: function() {
      return this.$store.getters?.cacheRoutes
    },
  },
  watch: {
    //监测路由变化
    $route() {
      this.addTag()
    },
    "tagMenu.visible": function() {
      if (this.tagMenu.visible)
        window.addEventListener("click", this.closeMenu)
      else
        window.removeEventListener("click", this.closeMenu)
    },
  },
  methods: {
    // 是否活动标签
    isActive(route) {
      return route.path === this.$route.path
    },
    // 是否固定标签
    isAffix(route) {
      return route.meta && route.meta.affix
    },
    initialAffix() {
      //初始化固定的标签页，默认第一个是本地constantRoutes中的框架组件
      const affixs = this.$router.options.routes[0]?.children.filter((v) => v.meta?.affix)

      affixs.forEach((v) => {
        this.$store.commit("tagsBar/ADD", v)
      })
    },
    // 显示标签的右键菜单
    showMenu(tag, event) {
      this.selectedTag = tag
      this.tagMenu.visible = true
      this.tagMenu.top = event.clientY
      this.tagMenu.left = event.clientX
    },
    // 刷新，重新加载
    // 缓存排除；不显示到标签链
    refresh(tag) {
      //移除去掉缓存，再重定向跳转到当前页面
      this.$store.commit("tagsBar/REMOVE_NAME", this.$route)
      this.$nextTick(() => {
        this.$router.replace({
          path: "/redirect" + tag.path,
        })
      })
    },
    closeMenu() {
      this.tagMenu.visible = false
    },
    addTag() {
      // 为了照顾一下动态路由，手动匹配一下路由信息
      let route = listRoutes.filter(s => s.path === this.$route.path)?.[0] ?? this.$route

      //添加到缓存路由中，排除跳转页面，
      if (this.$route.name === "redirect") return
      this.$store.commit("tagsBar/ADD", route)
    },
    handleClose(tag) {
      tag ??= this.selectedTag
      const index = this.cacheRoutes.indexOf(tag)
      this.$store.commit("tagsBar/REMOVE", tag)
      if (this.isActive(tag)) {
        if (this.cacheRoutes[index]) this.$router.push(this.cacheRoutes[index])
        else this.$router.push(this.cacheRoutes[index - 1].path)
      }
      // 如果关闭的是当前：则显示下一个，否则前一个。
      // 如果关闭的不是当前激活项，则不管
      // 前面始终会有一个固定的首页
    },
    handleCloseOther() {
      this.$store.commit("tagsBar/REMOVE_OTHERS", this.selectedTag)
      // 如果选中的是激活，则不跳转；否则跳转到选中项
      if (!this.isActive(this.selectedTag)) {
        this.$router.push(this.selectedTag)
      }
    },
    handleCloseAll() {
      this.$store.commit("tagsBar/CLEAR")
      //路由到剩下的
      if (!this.isActive(this.cacheRoutes[0])) {
        this.$router.push(this.cacheRoutes[0] ?? "/")
      }
    },
  },
}
</script>

<style lang="less" scoped>
.tagsbar-wrapper {
  list-style-type: none;
  display: flex;
  margin: 12px 20px 0 0px;
  line-height: 38px;

  // 标签项
  .item {
    padding: 0 12px;
    margin: 0 1px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    position: relative;
    border-radius: 2px 2px 0 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .title {
      margin-left: 2px;
    }

    // 小分割线
    &:nth-of-type(n + 2):not(.active):before {
      content: "⋮";
      position: absolute;
      left: -3px;
      color: #fff9;
    }

    .close {
      opacity: 0.5;
      position: relative;
      left: 6px;
      border-radius: 2px;
      padding: 1px;
    }

    &:hover {
      background-color: #0002;

      .close {
        opacity: 1;
      }
    }

    &:hover .close:hover {
      background: #f72525;
      color: #fff;
    }
  }

  // 标签项-激活
  .item.active {
    background-color: var(--main-bbgcolor);
    color: var(--theme-hcolor);
    margin-right: -1px; //遮住分隔符“⋮”
    position: relative;

    & .close {
      opacity: 1;
    }

    // 加一点连接凹槽弧度效果
    &::before {
      content: "";
      width: 5px;
      height: 5px;
      position: absolute;
      left: -5px;
      bottom: 0;
      background: radial-gradient(circle at 0 0, transparent 5px, var(--main-bbgcolor) 6px);
    }

    &::after {
      content: "";
      width: 5px;
      height: 5px;
      position: absolute;
      right: -5px;
      bottom: 0;
      background: radial-gradient(circle at 100% 0, transparent 5px, var(--main-bbgcolor) 6px);
    }
  }
}

// 右键菜单
.context-menu {
  list-style-type: none;
  position: absolute;
  color: #000;
  font-size: 14px;
  padding: 0px;
  z-index: 2004;

  li {
    padding: 0 8px;
    line-height: 32px;
    min-width: 140px;
    cursor: pointer;

    &:hover {
      background-color: #0001;
    }
  }
}
</style>
