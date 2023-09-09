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
      :before-upload="handeleBefore"
    >
      <!-- 上传按钮 -->
      <i slot="default" class="el-icon-plus"></i>
      <!-- 提示内容 -->
      <div slot="tip" style="font-size:0.8em">支持最多 {{ limit }} 张图片，每张图片不超过 {{ maxSize }}KB</div>
      <!-- file模板，单个图片的显示 -->
      <div slot="file" slot-scope="{file}" class="img-upload-item" :class="{ success: file.status === 'success' }">
        <!-- 缩略图的路径，如果相对路径则添加代理前缀-->
        <img :src="proxyURL(file.url)" :title="file.status" />
        <!-- 图片上传中的状态 -->
        <span v-if="file.status !== 'success'" class="loading">
          <i class="el-icon-loading"></i>
          <br />
          <span>正在上传...</span>
        </span>
        <!-- 操作按钮 -->
        <span class="el-upload-list__item-actions" v-if="file.status === 'success'">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <!-- 嵌套的dialog，预览图片，需要设置append-to-body，嵌入自身到body元素 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body custom-class="imgupload-dialog" top="none">
      <img :src="proxyURL(dialogImageUrl)" alt />
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
    round: { type: Boolean, default: false }  //显示为圆形（50%border-radius）
  },
  data() {
    return {
      dialogVisible: false, // 预览框显示状态
      dialogImageUrl: '',   // 预览框图片地址
      fileList: [],         // 内部绑定使用的文件集合
      isInnerChange: false, // 是否内部变更，标志文件变化是否来自内部，便于value的监测同步
    }
  },
  computed: {
    /**
     * 当达到上传文件数量限制的时候，隐藏上传按钮
     */
    uploadButtonVisible() { return this.fileList?.length >= this.limit },
  },
  watch: {
    value() {
      this.initialize()
    }
  },
  mounted() {
    this.initialize()
  },
  methods: {
    /**
     * value值初始化fileList
     */
    initialize() {
      // 内部修改的value值，则不触发
      if (this.isInnerChange) {
        this.isInnerChange = false
        return
      }
      this.fileList = this.value ? this.value.split(',').map(f => { return { url: f, name: f.match(/\/([^/]+)$/)[1] } }) : []
    },

    //超出数量限制
    onOutOfLimit() {
      this.$message.warning('文件上传个数超过限制！')
    },
    /**
     * 自定义的文件上传，基于axios封装，便于统一处理授权和异常
     */
    uploadFile(para) {
      upload(para.file)
        .then(data => {
          // 如果网络故障，data会为 undefined
          if (!data) {
            this.$refs.upload.uploadFiles.remove(f => f.status !== 'success')
            return
          }
          this.fileList.push({ name: data.name, url: data.url })
          this.emitValue()
        })
    },
    //预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    proxyURL,
    //删除项
    handleRemove(file) {
      this.fileList.remove(f => f.url == file.url)
      this.emitValue()
    },
    //上传之前，用于验证
    handeleBefore(file) {
      if (file.size / 1024 > this.maxSize) {
        this.$message.error(`文件大小超过限制：${this.maxSize}Kb`)
        return false
      }
    },
    //更新prop
    emitValue() {
      this.isInnerChange = true
      this.$emit('input', this.fileList.map(f => f.url).join(','))
    },
  }
}
</script>

<style lang='less' scoped>
.img-upload-item {
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // 图片上传中的状态
  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: #0005;
    text-align: center;
    padding: 40px 0;
    color: #eee;
    i {
      font-size: 24px;
    }
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
    content: "✔";
    position: absolute;
    line-height: 1em;
    right: 3px;
    top: 0px;
    color: #fff;
  }
}
</style>

<style lang="less">
.imgupload-dialog {
  width: max-content;
  height: max-content;
  max-width: 90vw;
  max-height: 90vh;
  transform: translateY(calc(50vh - 50%));
  img {
    max-width: 100%;
    max-height: calc(90vh - 60px);
    object-fit: contain;
  }
}

.imgupload-dialog .el-dialog__header {
  background: none;
}

/* 达到数量时，隐藏上传按钮 */
.img-upload-btn-hidden .el-upload--picture-card {
  display: none;
}

/* 圆角样式 */
.img-upload-round .el-upload--picture-card,
.img-upload-round .el-upload-list__item {
  border-radius: 50%;
}

/* 缩略图都小一点吧 */
.el-upload--picture-card,
.el-upload-list--picture-card .el-upload-list__item {
  width: 120px;
  height: 120px;
  line-height: 125px;
}

/* 调整/取消动画 */
.el-list-enter-active,
.el-list-leave-active {
  transition: none;
}
</style>
