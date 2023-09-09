<template>
  <el-form label-width="130px" label-suffix="：" class="view">
    <div style="margin:20px">
      <p>主要封装了图片处理逻辑（自定义axios上传）</p>
      <pre class="code">
cnpm i @wangeditor/editor -S
        <br />cnpm i @wangeditor/editor-for-vue -S
      </pre>
    </div>
    <el-form-item label="富文本表单">
      <Editor v-model="html" height="240px" :maxLength="500"></Editor>
    </el-form-item>

    <el-form-item label="内容v-html">
      <div v-html="html" style="border:1px solid #0003"></div>
    </el-form-item>
    <el-form-item label="内容v-text">
      <el-input v-model="html" type="textarea" :rows="5"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>

import Editor from '@/components/Editor.vue'


export default {
  name: "editor",
  components: { Editor },
  data() {
    return {
      html: '<p><strong>Git</strong>是当前<span style="color: rgb(225, 60, 57);">最先进、最主流</span>的分布式版本控制系统，<u>免费、开源</u>！核心能力就是版本控制。<br/><img src="api/file/f1.jpg" style="width: 120px;"/></p>'
    }
  },
  created() {
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
.code {
  padding: 5px;
  margin: 5px;
  background: #000c;
  color: #f8951c;
  letter-spacing: 0.5px;
}
</style>
