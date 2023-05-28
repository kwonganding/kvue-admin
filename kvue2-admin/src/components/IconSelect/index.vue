<template>
<div>
  <el-input v-model="value" placeholder="">
    <template slot="prepend"><i :class="value"></i></template>
  </el-input>
  <p>element-icons</p>
  <i v-for="name in elementIcons" :class="name" :key="name" v-once @click="iconClick(name)"></i>


  <p>iconfont-icons</p>
  <i v-for="name in iconfontIcons" :class="'iconfont icon-' + name" :key="name" v-once
    @click="iconClick('iconfont icon-' + name)"></i>
</div>
</template>

<script>

import elementIcons from './element-icons'
import iconfontIcons from './iconfont-icons'

export default {
  name: 'IconSelect',
  data() {
    return {
      value: '',
      elementIcons,
      iconfontIcons,
    }
  },
  methods: {
    iconClick(name) {
      this.value = name

      // let s = document.getElementsByClassName('icon-gouwuche1'); 
      // let i =0;let m = s.length
      // let id = setInterval(() => {
      //   s[i++].click()
      //   if (i >= m) clearInterval(id)
      // }, 100);

      //获取一致名字
      //Array.from(document.querySelectorAll('.icon-name')).map(s=>s.title)

    }
  }
}
</script>

<style lang='less' scoped>
i {
  font-size: 20px;
  margin: 5px;
  // iconfont的坑，i默认是行内元素，transform不起作用，改成行内块元素
  display: inline-block;

  &:hover {
    transform: scale(1.5);
    color: #409EFF;
  }
}
</style>
