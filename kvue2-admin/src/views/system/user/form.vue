<!-- 表单编辑-dialog弹框 -->
<template>
  <el-dialog
    append-to-body
    v-bind="$attrs"
    :visible.sync="visible"
    :show-close="false"
    :fullscreen="fullscreen"
    width="800px"
    top="10vh"
  >
    <!-- 标题栏：标题+窗体按钮 -->
    <template #title>
      <span>
        <i class="el-icon-edit"></i>
        {{title}} 用户信息
      </span>
      <span style="float:right;margin-top:-5px">
        <el-button
          icon="el-icon-full-screen"
          type="text"
          @click="fullscreen=!fullscreen"
          title="全屏"
          style="font-size: 16px;"
        ></el-button>
        <el-button icon="el-icon-close" type="text" @click="close" title="关闭" style="color:red;font-size: 16px;"></el-button>
      </span>
    </template>

    <!-- form表单 -->
    <el-form
      v-loading="loading"
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-suffix="："
      style="margin: 10px 10px -10px 0;"
    >
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
            <TreeSelect v-model="formData.departmentId" :data="departments"></TreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态" prop="state">
            <el-radio-group v-model="formData.state">
              <el-radio border v-for="e in enumUse.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio>
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
        <el-input v-model="formData.remark" type="textarea" :rows="4" maxlength="500"></el-input>
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

    <!-- 底部操作按钮 -->
    <div slot="footer" style="text-align:center">
      <el-button @click="close" icon="el-icon-circle-close">取消</el-button>
      <el-button
        @click="save"
        type="primary"
        icon="el-icon-success"
        :disabled="loading"
        :loading="saveLoading"
        v-throttle
      >保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@/mixins/crud.js'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'

import TreeSelect from '@/components/TreeSelect.vue'
import { enumUse, enumGender } from '@/model/enums'
import { checkPhone, checkEmail } from '@/utils/validate'

export default {
  name: 'UserForm',
  components: { TreeSelect },
  mixins: [form],
  data() {
    return {
      enumUse,
      enumGender,
      roles: [{ id: 1, name: 'ssss1' }, { id: 2, name: 'ssss2' }], // 所有角色集合
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
  watch: {
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen() {
      if (!this.keyId) {
        this.formData.gender = enumGender.values[0].key
        this.formData.state = enumUse.values[0].key
        this.formRules.pwd[0].required = true
      }
      else {
        this.formRules.pwd[0].required = false
      }
    },
  }
}
</script>
