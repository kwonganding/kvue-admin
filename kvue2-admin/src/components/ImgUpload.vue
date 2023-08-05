<template>
  <div>
    <!-- 注意表单中文件字段名应该和服务端接口一致：name="file"-->
    <el-upload
      ref="upload"
      action="#"
      :http-request="uploadFile"
      list-type="picture-card"
      :multiple="true"
      accept="image/*"
      name="file"
      :limit="limit"
      :class="{ 'img-upload-btn-hidden': uploadButtonVisible,'img-upload-round':round}"
      :file-list.sync="fileList"
      :on-exceed="onOutOfLimit"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="handeleBefore"
      :on-change="handleChange"
    >
      <!-- 上传按钮 -->
      <i slot="default" class="el-icon-plus"></i>
      <!-- 提示内容 -->
      <div slot="tip" style="font-size:0.8em">支持最多{{ limit }}张图片，每张图片不超过{{ maxSize }}KB</div>
      <!-- file模板，单个图片的显示 -->
      <div slot="file" slot-scope="{file}" class="imgbox" :class="{ success: file.status === 'success' }">
        <!-- 缩略图的路径，如果相对路径则添加代理前缀-->
        <img :src="proxyURL(file.url)" :title="file.status" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <!-- 嵌套的dialog，需要设置append-to-body，嵌入自身到body元素 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body custom-class="imgupload-dialog" top="none">
      <img :src="proxyURL(dialogImageUrl)" alt style="max-width: 100%;max-heigt: 100%;object-fit:contain" />
    </el-dialog>
  </div>
</template>

<script>

import { upload, proxyURL } from '@/api/file'

export default {
  name: 'ImgUpload',
  props: {
    value: { type: String, default: '' },     //文件路径(集合)字符串，多个逗号隔开
    limit: { type: Number, default: 5 },      //数量限制
    maxSize: { type: Number, default: 2048 }, //文件大小限制（单位KB)
    round: { type: Boolean, default: false }  //文件大小限制（单位KB)
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [], // 内部绑定使用的文件集合
      isInnerChange: false, // 是否内部变更，标志文件变化是否来自内部，便于value的监测同步
    }
  },
  computed: {
    // 当达到上传文件数量限制的时候，隐藏上传按钮
    uploadButtonVisible() { return this.fileList?.length >= this.limit },
  },
  watch: {
    value() {
      if (this.isInnerChange) return
      this.resetFileList()
    }
  },
  mounted() {
    this.resetFileList()
  },
  methods: {
    updateFileList() {
      console.log('resetFileList')
      this.fileList = this.value ? this.value.split(',').map(f => { return { url: f, name: f.match(/\/([^/]+)$/)[1] } }) : []
      this.isInnerChange = false
    },

    //超出数量限制
    onOutOfLimit() {
      this.$message.warning('文件上传个数超过限制！')
    },
    uploadFile(para) {
      console.log('uploadFile', para)
      // 这里不管服务端是否添加成功，都保存到了fileList中，需要
      // 能不先不加？
      // this.resetFileList()

      upload(para.file)
        .then(data => {
          console.log('res', data)
          console.log(this.fileList)
          this.fileList.push({ name: data.name, url: data.url })
          this.emitValue()
        })
      // .finally(() => { this.resetFileList() })
    },
    //预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    proxyURL(url) {
      return url.startsWith('/') ? process.env.VUE_APP_BASE_API + url : url
    },
    //删除项
    handleRemove(file) {
      this.fileList.remove(f => f.url == file.url)
      this.emitValue()
    },
    //上传之前，用于验证
    handeleBefore(file) {
      console.log('before')

      if (file.size / 1024 > this.maxSize) {
        this.$message.error(`文件大小超过限制：${this.maxSize}Kb`)
        return false
      }
    },


    handleChange(file) {
      console.log('on-change', file)
    },
    // 上传成功
    handleSuccess(res, file, list) {
      console.log('success', res)

      // 验证

      this.fileList.push(file)
      // this.fileList = Array.from(this.fileList)  //强制更新
      this.emitValue()
    },
    handleError(err) {
      this.$message.error('上传失败，请重试：' + err)
    },
    //更新prop
    emitValue() {
      this.$emit('input', this.fileList.map(f => f.response ? f.response.url : f.url).join(','))
    },
  }
}
</script>

<style lang='less' scoped>
.imgbox {
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // 缩略图上加一个状态提示
  &.success::before {
    content: "";
    position: absolute;
    right: 0px;
    width: 0;
    height: 0;
    text-align: center;
    border-top: 24px solid #13ce66;
    border-left: 30px solid transparent;
  }

  &.success::after {
    content: "✓";
    position: absolute;
    right: 3px;
    top: -4px;
    color: #fff;
  }
}
</style>

<style>
.imgupload-dialog {
  width: max-content;
  height: max-content;
  max-width: 90vw;
  max-height: 90vh;
  transform: translateY(calc(50vh - 50%));
}

.imgupload-dialog .el-dialog__header {
  background: none;
}

/* 达到数量时，隐藏上传按钮 */
.img-upload-btn-hidden .el-upload--picture-card {
  display: none;
}
.img-upload-round .el-upload-list__item {
  border-radius: 50%;
}

/* 调整/取消动画 */
.el-list-enter-active,
.el-list-leave-active {
  transition: none;
}
</style>
