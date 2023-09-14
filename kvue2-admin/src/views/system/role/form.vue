<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDrawer
    :title="title+'角色'"
    size="660px"
    @save="save"
    @close="close"
    :save-loading="saveLoading"
    :is-modified="isModified"
    :visible.sync="visible"
  >
    <!-- form表单 -->
    <el-form v-loading="loading" ref="form" :model="formData" :rules="formRules" label-width="90px" label-suffix="：">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="formData.name" maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio border v-for="e in enumState.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="分配权限" prop="roleIds">
        <el-tree multiple style="width:100%"></el-tree>
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
  </FormDrawer>
</template>

<script>
import { form } from '@/mixins/crud.js'
import FormDrawer from '@/components/FormDrawer.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/role.js'
import { enumState } from '@/model/enums'

export default {
  name: 'RoleForm',
  components: { FormDrawer },
  mixins: [form],
  data() {
    return {
      enumState,
      formRules: {
        name: [{ required: true, message: '必填' }],
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
  }
}
</script>
