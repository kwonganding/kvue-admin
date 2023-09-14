<!-- 用于表单的编辑弹框 -->

<template>
  <el-dialog
    ref="dialog"
    append-to-body
    v-bind="$attrs"
    :visible="visible"
    :show-close="false"
    :fullscreen="fullscreen"
    class="form-dialog"
  >
    <!-- 标题栏：标题+窗体按钮 -->
    <template #title>
      <slot name="title">
        <div class="form-dialg-title">
          <span>
            <i :class="icon" style="font-size:16px"></i>
            {{title}}
          </span>
          <!-- 按钮 -->
          <span>
            <el-button icon="el-icon-full-screen" type="text" @click="fullscreen=!fullscreen" title="全屏"></el-button>
            <el-button icon="el-icon-close" type="text" @click="onClose" title="关闭" style="color:red;"></el-button>
          </span>
        </div>
      </slot>
    </template>

    <!-- 主内容区域，默认插槽 -->
    <slot></slot>

    <!-- 底部操作按钮 -->
    <template #footer>
      <slot name="footer">
        <div style="text-align:center">
          <el-button @click="onClose" icon="el-icon-circle-close">取消</el-button>
          <el-button @click="onSave" type="primary" icon="el-icon-success" :loading="saveLoading" v-throttle>保存</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    visible: { default: false, type: Boolean },     // 是否显示
    isModified: { default: true, type: Boolean },   // 表单值是否已修改
    saveLoading: { default: false, type: Boolean }, // 保存状态
    title: { type: String },                        // 标题
    icon: { default: 'el-icon-edit', type: String } // 标题图标
  },
  data() {
    return {
      fullscreen: false,   // 是否全屏
    }
  },
  mounted() {
    this.$refs.dialog.$on('update:visible', (value) => {
      // 如果表单值已修改，则不支持内部关闭，只能用户手动关闭
      if (!this.isModified)
        this.$emit('update:visible', value)
    })
  },
  methods: {
    onSave() {
      this.$emit('save')
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>
