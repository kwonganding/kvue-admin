<!-- 用于表单的编辑-抽屉弹框 -->

<template>
  <el-drawer ref="dialog" append-to-body v-bind="$attrs" :visible="visible" class="form-drawer" :show-close="false">
    <!-- 标题栏：标题+窗体按钮 -->
    <template #title>
      <slot name="title">
        <div class="form-dialg-title">
          <span>
            <i :class="icon" style="font-size:16px"></i>
            {{title}}
          </span>
          <!-- 按钮 -->
          <span style="margin: 1px 6px">
            <el-button @click="onClose" icon="el-icon-circle-close">取消</el-button>
            <el-button @click="onSave" type="primary" icon="el-icon-success" :loading="saveLoading" v-throttle>保存</el-button>
          </span>
        </div>
      </slot>
    </template>
    <!-- 主内容区域，默认插槽 -->
    <slot></slot>
  </el-drawer>
</template>

<script>
export default {
  name: 'FormDrawer',
  props: {
    visible: { default: false, type: Boolean },     // 是否显示
    isModified: { default: true, type: Boolean },   // 表单值是否已修改
    saveLoading: { default: false, type: Boolean }, // 保存状态
    title: { type: String },                        // 标题
    icon: { default: 'el-icon-edit', type: String } // 标题图标
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
