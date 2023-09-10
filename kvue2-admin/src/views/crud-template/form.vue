<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDialog
    :title="title+'用户'"
    width="800px"
    top="10vh"
    @save="save"
    @close="close"
    :save-loading="saveLoading"
    :visible="visible"
  >
    <!-- form表单 -->
    <el-form v-loading="loading" ref="form" :model="formData" :rules="formRules" label-width="100px" label-suffix="：">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="formData.name" maxlength="32" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model.trim="formData.nickname" maxlength="32" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model.trim="formData.phone" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="formData.email" maxlength="32" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="formData.state">
              <el-radio border v-for="e in enumState.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="departmentId"></el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="分配角色" prop="roleIds">
        <el-select v-model="formData.roleIds" multiple clearable placeholder="选择角色，支持多个" style="width:100%">
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="2" maxlength="500"></el-input>
      </el-form-item>

      <el-row v-show="keyId">
        <el-col :span="12">
          <el-form-item label="创建时间">
            <span>{{formatTime(formData.createTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间">
            <span>{{formatTime(formData.lastTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </FormDialog>
</template>

<script>
import { form } from '@/mixins/crud.js'
import FormDialog from '@/components/FormDialog.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'
import { enumState } from '@/model/enums'

export default {
  name: 'Form',
  components: { FormDialog },
  mixins: [form],
  data() {
    return {
      enumState,
      formRules: {
        name: [{ required: true, message: '必填' }],
        nickname: [{ required: true, message: '必填' }],
      },
    }
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（必须实现）：创建一个空的表单对象
    newFromData() {
      return {
        name: undefined,
        roleIds: undefined,
        remark: undefined,
        state: enumState.values[0].key,
      }
    },

    save() {
      this.$message.warning('模板页面，删掉该方法即可')
    }
  }
}
</script>
