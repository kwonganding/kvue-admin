<!-- 小组件测试 -->
<template>
  <div class="cards view">
    <el-card :header="`图标选择器：${icon}`" class="item">
      <div class="m10">
        <IconSelect v-model="icon" clearable></IconSelect>
      </div>
      <div class="m10">
        <IconSelect
          v-model="icon"
          :disabled="setting.disabled"
          :clearable="setting.clearable"
          :hide-on-selected="setting.hideOnSelected"
        ></IconSelect>
      </div>
    </el-card>

    <el-card :header="`树选择器：${tree.value}`" class="item">
      <div class="m10">
        <TreeSelect
          :data="tree.data"
          v-model="tree.value"
          placeholder="请选择"
          clearable
          :filterable="true"
          :options="{ value: 'id', label: 'name', children: 'children' }"
        ></TreeSelect>
      </div>
      <div class="m10">
        <TreeSelect
          :data="tree.data"
          v-model="tree.value"
          :disabled="setting.disabled"
          :clearable="setting.clearable"
          :hide-on-selected="setting.hideOnSelected"
          :only-leaf="setting.onlyLeaf"
          :filterable="setting.filterable"
          :options="{ value: 'id', label: 'name', children: 'children' }"
        ></TreeSelect>
      </div>
    </el-card>

    <el-card class="item" header="小组件配置（第二排有效）">
      <el-checkbox label="disabled" v-model="setting.disabled" class="m10"></el-checkbox>
      <el-checkbox label="clearable" v-model="setting.clearable" class="m10"></el-checkbox>
      <el-checkbox label="hide-on-selected-选中后关闭" v-model="setting.hideOnSelected" class="m10"></el-checkbox>

      <el-checkbox label="filterable（树选择器：开启搜索过滤）" v-model="setting.filterable" class="m10"></el-checkbox>
      <el-checkbox label="only-leaf（树选择器：只能选择叶子节点）" v-model="setting.onlyLeaf" class="m10"></el-checkbox>

      <el-button type="info" @click="setTreeDisable" class="m10">setTreeDisable（设置树选择器，第2个节点不可用）</el-button>
      <br />
      <el-input v-model="setting.text" clearable class="m10" style="width: 120px" placeholder="树搜索"></el-input>
      <el-button type="primary" @click="searchTree" class="m10" icon="el-icon-search">搜索树</el-button>
    </el-card>

    <el-card header="消息提示" class="item">
      <p class="m10">把ElementUI的常用提示组件($message、$alert、$confirm、$notify)的不同类型方法，都注册到了VUE原型上了，便于使用。</p>
      <span class="m10">消息类型：</span>
      <el-radio-group v-model="messageType" class="m10">
        <el-radio-button label="success">success</el-radio-button>
        <el-radio-button label="warning">warning</el-radio-button>
        <el-radio-button label="info">info</el-radio-button>
        <el-radio-button label="error">error</el-radio-button>
      </el-radio-group>
      <br />
      <el-button type="text" class="m10" @click="$message[messageType]('消息内容', '消息标题')">$message.success(mes,title)</el-button>
      <el-button type="text" class="m10" @click="$alert[messageType]('消息内容', '消息标题')">$alert.success(mes,title)</el-button>
      <el-button type="text" class="m10" @click="$confirm[messageType]('消息内容', '消息标题')">$confirm.success(mes,title)</el-button>
      <el-button type="text" class="m10" @click="$notify[messageType]('消息内容', '消息标题')">$notify.success(mes,title)</el-button>
    </el-card>
  </div>
</template>

<script>

import IconSelect from "@/components/IconSelect"
import TreeSelect from "@/components/TreeSelect"
import { list2Tree, filterTree, setTreeDisable } from "@/utils/tree.js"

const treeList = [
  { id: 1, name: "北京", pid: 0 },
  { id: 2, name: "广州", pid: 0 },
  { id: 21, name: "福州", pid: 2 },
  { id: 22, name: "佛山", pid: 2 },
  { id: 221, name: "无影脚", pid: 22 },
  { id: 3, name: "四川", pid: 0 },
  { id: 31, name: "成都", pid: 3 },
  { id: 32, name: "攀枝花", pid: 3 },
  { id: 33, name: "绵阳", pid: 3 },
  { id: 34, name: "南充", pid: 3 },
  { id: 311, name: "高新区", pid: 31 },
  { id: 312, name: "武侯区", pid: 31 },
  { id: 313, name: "双流区", pid: 31 },
  { id: 314, name: "青羊区", pid: 31 },
  { id: 3141, name: "恐龙广场", pid: 314 },
]

export default {
  name: "components",
  components: { IconSelect, TreeSelect },
  data() {
    return {
      setting: {
        disabled: false,
        clearable: false,
        hideOnSelected: true,

        filterable: false,
        onlyLeaf: true,
        text: '',
      },
      icon: 'el-icon-user-solid',
      tree: {
        // 这里用 setTreeDisable是初始化下disable属性
        data: setTreeDisable(list2Tree(treeList)),
        value: 21,
      },
      form: {
        icon: "",
        city: 3,
      },
      messageType: 'success',
    }
  },
  methods: {
    searchTree() {
      let data = this.tree.data
      let rdata = filterTree(data, (item) => item.name.includes(this.setting.text))
      console.log(rdata)
    },
    setTreeDisable() {
      setTreeDisable(this.tree.data, this.tree.data[1])
      console.log(this.tree.data)
    },
  },
}
</script>

<style lang="less" scoped>
.cards {
  display: flex;
  flex-flow: row wrap;
  align-items: start;
  width: 100%;

  .item {
    min-width: 200px;
    margin: 10px 20px 20px 0;
    flex: 1 1 400px;
    height: max-content;

    .m10 {
      margin: 10px;
    }
  }
}
</style>
