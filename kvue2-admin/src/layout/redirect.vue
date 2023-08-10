// 用于中转跳转的页面
<script>
export default {
  name: 'redirect',
  created() {
    this.$router.replace({ path: '/' + this.$route.params.path, query: this.$route.query })
  },
  render: function(h) {
    return h()
  }
}
</script>
