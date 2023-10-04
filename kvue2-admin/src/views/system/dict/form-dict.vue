<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDialog
    :title="title+'字典类型'"
    width="600px"
    top="10vh"
    @save="save"
    @close="close"
    :save-loading="saveLoading"
    :is-modified="isModified"
    :visible.sync="visible"
  >
    <!-- form表单 -->
    <el-form v-loading="loading" ref="form" :model="formData" :rules="formRules" label-width="110px" label-suffix="：">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="formData.name" maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型编码" prop="type">
        <el-input v-model.trim="formData.type" maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否树形结构" prop="isTree">
        <el-radio-group v-model="formData.isTree">
          <el-radio border :key="1" :label="1">是</el-radio>
          <el-radio border :key="0" :label="0">否</el-radio>
        </el-radio-group>
        <el-tooltip class="item" effect="dark" content="用来设置字典数据是否支持树形结构，默认‘否’单级结构" placement="top-end">
          <i class="el-icon-warning" style="margin-left: 10px;font-size: 16px;vertical-align: middle;"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </FormDialog>
</template>

<script>
import { form } from '@/mixins/crud.js'
import FormDialog from '@/components/FormDialog.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/dict.js'

export default {
  name: 'DictForm',
  components: { FormDialog, },
  mixins: [form],
  data() {
    return {
      formRules: {
        name: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
      },
    }
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（必须实现）：创建一个空的表单对象
    newFromData() {
      return {
        name: undefined,
        type: undefined,
        isTree: 0,
      }
    },

  }
}
</script>
