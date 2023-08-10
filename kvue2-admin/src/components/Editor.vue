
<template>
  <div style="border: 1px solid #DCDFE6">
    <Toolbar style="border-bottom: 1px solid #DCDFE6" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      :style="{height: height} "
      style="overflow-y: hidden;"
      v-model="content"
      :defaultConfig="editorConfig"
      @onMaxLength="onMaxLength"
      :mode="mode"
      @onCreated="onCreated"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>

import { upload, proxyURL } from '@/api/file'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { throttle } from '@/utils/util.js'

const MENU_CONF = {
  // 配置图片上传
  uploadImage: {
    fieldName: 'file', //表单参数名，和后端一致
    maxFileSize: 2 * 2048 * 2048,  //最大文件大小
    maxNumberOfFiles: 1, //每次文件个数
    allowedFileTypes: ['image/*'], //文件类型：图片
    timeout: 9 * 1000,  //超时时长
    customUpload(file, insertFn) {
      console.log('customUpload', file)
      upload(file)
        .then(data => {
          if (!data) return
          // 插入图片，图片地址代理一下（兼容开发环境）
          insertFn(proxyURL(data.url), 'Image')
        })

    },
  }
}

export default {
  components: { Editor, Toolbar },
  props: {
    value: { type: String },       //富文本内容，外部传入，需用.sync修饰
    height: { default: '220px' },  //高度
    maxLength: { type: Number, default: 4000 } // 最大内容长度
  },
  computed: {
    content: {
      get() { return this.value },
      set(value) { this.$emit('input', value) }
    }
  },
  data() {
    return {
      editor: null,
      toolbarConfig: { excludeKeys: ['group-video', 'emotion', 'lineHeight'] },
      editorConfig: {
        placeholder: '请输入内容...',
        maxLength: this.maxLength,
        MENU_CONF,
      },
      mode: 'default', // default simple
      onOutOfMaxLength: throttle(() => this.$message.warning('富文本内容长度超过最大值：' + this.editorConfig.maxLength), 3000),
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错。seal方法封闭一个对象
    },
    onMaxLength() {
      // 限流提示错误
      this.onOutOfMaxLength()
    }
  },
  beforeDestroy() {
    this.editor?.destroy()// 组件销毁时，及时销毁编辑器
  },
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
/* 调整下工具栏默认样式，工具栏高度32px（默认40px） */
.w-e-bar-item {
  padding: 1px;
  height: 32px;
}
.w-e-drop-panel,
.w-e-bar-item-group .w-e-bar-item-menus-container {
  margin-top: 32px;
}
.w-e-bar-divider {
  margin: 4px;
  height: auto;
}
</style>
