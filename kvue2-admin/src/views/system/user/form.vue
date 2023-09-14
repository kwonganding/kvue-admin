<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDialog
    :title="title+'用户'"
    width="800px"
    top="10vh"
    @save="save"
    @close="close"
    :save-loading="saveLoading"
    :is-modified="isModified"
    :visible.sync="visible"
  >
    <!-- form表单 -->
    <el-form v-loading="loading" ref="form" :model="formData" :rules="formRules" label-width="100px" label-suffix="：">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="name">
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
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio-button v-for="e in enumGender.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="pwd">
            <el-input
              v-model="formData.pwd"
              maxlength="32"
              show-password
              clearable
              :placeholder="keyId?'修改密码才需要填写':'请设置初始密码'"
            ></el-input>
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
          <el-form-item label="所属部门" prop="departmentId">
            <TreeSelect v-model="formData.departmentId" :data="departments" clearable :only-leaf="false"></TreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态" prop="state">
            <el-radio-group v-model="formData.state">
              <el-radio border v-for="e in enumState.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="分配角色" prop="roleIds">
        <el-select v-model="formData.roleIds" multiple clearable placeholder="选择角色，支持多个" style="width:100%">
          <el-option v-for="r in roles" :key="r.id" :value="r.id" :label="r.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" maxlength="500"></el-input>
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
import { getRoles } from '@/api/role.js'

import TreeSelect from '@/components/TreeSelect.vue'
import { enumState, enumGender } from '@/model/enums'
import { checkPhone, checkEmail } from '@/utils/validate'

export default {
  name: 'UserForm',
  components: { FormDialog, TreeSelect },
  mixins: [form],
  data() {
    return {
      enumState,
      enumGender,
      roles: [], // 所有角色集合
      departments: [], //部门集合树
      formRules: {
        name: [{ required: true, message: '必填' }],
        nickname: [{ required: true, message: '必填' }],
        departmentId: [{ required: false, message: '必填' }],
        pwd: [{ required: true, message: '必须设置初始密码' },
        { min: 4, max: 16, message: '长度应为4-16', trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
      },
    }
  },
  created() {
    getRoles().then(res => {
      this.roles = res.data.list
    })
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（必须实现）：创建一个空的表单对象
    newFromData() {
      return {
        name: undefined,
        nickname: undefined,
        gender: enumGender.values[0].key,
        pwd: undefined,
        phone: undefined,
        email: undefined,
        departmentId: undefined,
        roleIds: [],
        remark: undefined,
        state: enumState.values[0].key,
      }
    },

    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen() {
      if (!this.keyId) { //新增
        this.formRules.pwd[0].required = true
      }
      else { //修改
        this.formRules.pwd[0].required = false
        // 强制验证一次，更新校验状态
        this.$refs.form.validate()


      }
    },

    // 复用部门列表
    beforeOpen([departments]) {
      this.departments = departments
    },
  }
}
</script>
