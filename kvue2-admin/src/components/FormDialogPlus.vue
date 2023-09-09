<!-- 用于表单的编辑弹框-大杯 -->

<template>
  <el-dialog
    v-bind="$attrs"
    :visible="visible"
    :show-close="false"
    class="form-dialog-plus"
    width="100%"
    top="0"
    :modal="false"
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
            <el-button @click="onClose" icon="el-icon-circle-close">取消</el-button>
            <el-button @click="onSave" type="primary" icon="el-icon-success" :loading="saveLoading" v-throttle>保存</el-button>
          </span>
        </div>
      </slot>
    </template>

    <!-- 主内容区域，默认插槽 -->
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialogPlus',
  props: {
    visible: { default: false, type: Boolean },     // 是否显示
    saveLoading: { default: false, type: Boolean }, // 保存状态
    title: { type: String },                        // 标题
    icon: { default: 'el-icon-edit', type: String } // 标题图标
  },
  data() {
    return {
      fullscreen: false,   // 是否全屏
    }
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
