<template>
  <el-form label-width="130px" label-suffix="：">
    <el-form-item label="头像-单图+圆">
      <ImgUpload v-model="img" :limit="1" :round="true"></ImgUpload>
      <code>{{ img }}</code>
    </el-form-item>

    <el-form-item label="多个图片">
      <ImgUpload v-model="imgs"></ImgUpload>
      <code>{{ imgs }}</code>
    </el-form-item>
  </el-form>
</template>

<script>

import ImgUpload from '@/components/ImgUpload.vue'

export default {
  name: "fileupload",
  components: {
    ImgUpload
  },
  data() {
    return {
      imgs: '/file/snap-22.jpg,/file/1691075365177-404.png,/file/bing21.jpg',
      img: '/file/f1.jpg',
    }
  },
  created() {
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
code {
  padding: 10px;
  background: #000c;
  color: #f8951c;
  letter-spacing: 0.5px;
}
</style>
