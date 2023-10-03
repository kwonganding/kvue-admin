<template>
  <div class="view" style="width: 100%;height: 100%;">
    <iframe style="width: 100%; height: 100%" :src="src" frameborder="no"></iframe>
  </div>
</template>

<script>
export default {
  name: 'iframe',
  data() {
    return {
      src: undefined,
      loading: false,
    }
  },
  created() {
    this.src = this.$route.params.href
  },
  mounted() {
  },
  methods: {

  }
}
</script>
