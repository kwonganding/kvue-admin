<template>
  <div>
    <img src="@/imgs/svg/404.svg" />
    <p>😭😅🤣</p>
    <b>抱歉，页面不见了～</b>
    <i>请查看网络连接情况，尝试刷新页面</i>
  </div>
</template>

<script>
export default {
  name: 'page404',
}
</script>

<style lang='less' scoped>
div {
  font-size: 2em;
  color: #0008;
  margin: 10vh auto;
  text-align: center;

  p {
    font-size: 2.2em;
    line-height: 2em;
  }

  b {
    color: #f00a;
    margin-left: 15px;
  }
}
</style>
