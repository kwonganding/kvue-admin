<!-- 个人用户中心，修改个人信息、修改密码 -->

<template>
  <el-container class="view warpper">
    <el-aside width="700px">
      <el-card shadow="never">
        <template #header>
          <i class="icon el-icon-user"></i>
          <span>个人信息</span>
        </template>
        <el-form v-loading="loading" ref="form" :model="formData" label-width="100px" label-suffix="：" class="content">
          <el-form-item label="头像">
            <ImgUpload v-model="formData.avatar" :limit="1" :round="true"></ImgUpload>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名">
                <span>{{formData.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门">
                <span>{{formData.departmentName}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="角色">
            <el-tag
              type="primary"
              v-for="tag in formData.roleNames"
              v-once
              :key="tag"
              style="margin-right: 5px;"
            >{{ tag }}</el-tag>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model.trim="formData.nickname" maxlength="32" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formData.gender">
                  <el-radio-button v-for="e in enumGender.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注/简介" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="4" maxlength="500"></el-input>
          </el-form-item>
          <el-row>
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

          <el-form-item>
            <el-button type="primary" v-loading="saveLoading" v-throttle @click="saveProfile">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-aside>

    <el-aside width="600px">
      <el-card shadow="never">
        <template #header>
          <i class="iconfont icon-securityscan"></i>
          <span>修改密码</span>
        </template>
        <el-form ref="fromPwd" :model="pwdData" :rules="pwdRules" class="content" label-width="110px" label-suffix="：">
          <el-form-item label="原有密码" prop="pwd">
            <el-input v-model="pwdData.pwd" placeholder="输入原有密码" show-password minlength="4" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="npwd1">
            <el-input v-model="pwdData.npwd1" placeholder="输入新密码" show-password minlength="4" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="npwd2">
            <el-input v-model="pwdData.npwd2" placeholder="再次输入新密码" show-password minlength="4" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-loading="saveLoading" v-throttle @click="savePwd">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
import { getById, updateProfile, updatePwd } from '@/api/user.js'
import { baseURL } from '@/utils/request'
import { enumGender } from '@/model/enums.js'
import { formatTime } from '@/utils/date.js'
import ImgUpload from '@/components/ImgUpload.vue'

export default {
  name: 'profile',
  components: { ImgUpload },
  data() {
    return {
      baseURL,
      enumGender,
      loading: false,      // 页面数据加载状态
      saveLoading: false,  // 保存状态
      formData: {},        // 当前表单数据
      pwdData: {},
      pwdRules: {
        pwd: '',
        npwd1: '',
        npwd2: '',
      },
    }
  },
  created() {
    this.loadData()
    const r1 = { required: true, message: '密码不可为空' }
    const r2 = { min: 4, max: 16, message: '长度应为4-16', trigger: 'blur' }
    const rsame = {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        if (value === this.pwdData.npwd1)
          callback()
        else
          callback(new Error())
      }, trigger: "blur", message: '两次新密码必须相同'
    }
    this.pwdRules.pwd = [r1, r2]
    this.pwdRules.npwd1 = [r1, r2]
    this.pwdRules.npwd2 = [r1, r2, rsame]
  },
  methods: {
    formatTime,
    // 加载个人信息
    loadData() {
      const id = this.$store.getters.userInfo?.id
      // 获取最新数据
      this.loading = true
      getById(id)
        .then(res => {
          this.formData = res.data
        })
        .finally(() => this.loading = false)
    },
    // 保存个人信息
    saveProfile() {
      this.saveLoading = true
      updateProfile(this.formData)
        .then(res => {
          this.$message.success(res.message)
        })
        .finally(() => { this.saveLoading = false })
    },
    // 修改密码
    savePwd() {
      this.$refs.fromPwd.validate((valid, mes) => {
        if (!valid) {
          this.$message.error('输入有误，请修改后重新提交！')
          return
        }
        this.saveLoading = true
        updatePwd(this.pwdData, this.formData.id)
          .then(res => {
            this.$message.success(res.message)
          })
          .finally(() => { this.saveLoading = false })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.warpper {
  height: 100%;
  overflow: auto;

  .el-aside {
    height: max-content;
  }
  .el-card {
    margin: 5px;
  }
  .content {
    padding: 15px;
  }
}
</style>
