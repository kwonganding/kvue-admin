<template>
  <div>
    <p pid="pbtn" v-on:click="log(1)">文件、富文本</p>
  </div>
</template>

<script>
import { delay, debounce, throttle, param2Obj } from "@/utils/util"

export default {
  name: "",
  data() {
    return {}
  },
  created() {
    window.delay = delay
    window.debounce = debounce
    window.throttle = throttle
    window.param2Obj = param2Obj

    delay(() => console.log("123"), 1000)()
  },
  methods: {
    log(arg) {
      console.log(arg)
    },
  },
}
</script>

<style lang="less" scoped>
.a {
  font-size: 15px;
  .b {
    color: red;
  }
}
</style>
