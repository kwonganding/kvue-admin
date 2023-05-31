<template>
<div class="login-page">
  <el-form :model="formData" ref="loginForm" class="login-form" :rules="formRules" @submit.prevent="">
    <div>
      <h3>系统登录</h3>
      <p>欢迎登录{{ title }}</p>
    </div>
    <el-form-item prop="name" required>
      <el-input v-model.trim="formData.name" placeholder="请输入用户名" prefix-icon="el-icon-user" maxlength="50"
        clearable></el-input>
    </el-form-item>

    <el-form-item prop="pwd" required>
      <el-input v-model="formData.pwd" placeholder="请输入密码" prefix-icon="el-icon-lock" maxlength="30" show-password
        @:keyup.enter.native="login"></el-input>
    </el-form-item>

    <el-button type="primary" :loading="loading" style="width:100%;margin-top:20px;height: 36px;border-radius: 18px;"
      @click="login" icon="el-icon-circle-check">登录</el-button>
  </el-form>
</div>
</template>

<script>
import defaultSetting from '@/settings'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      formData: {
        name: '',
        pwd: ''
      },
      formRules: {
        name: [{ required: true, message: '用户名不能为空' }, { min: 3, max: 8, message: "长度应为3-8" }],
        pwd: [{ required: true, message: '密码不能为空' }, { min: 3, max: 8, message: "长度应为3-8" }],
      }
    }
  },
  computed: {
    title() {
      return defaultSetting.title
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$refs.loginForm.validate((valid, mes) => {
        //验证
        if (!valid) {
          this.$message.error('输入有误，请修改后重新提交！')
          setTimeout(() => { this.loading = false }, 500)
          return
        }
        //调用api登录
        this.$store.dispatch('user/login', this.formData)
          .then(mes => {
            this.$message.success(mes)
            // 登录成功，跳转路由
            this.$router.push('/')
          })
          .catch(err => {
            this.$message.error(err)
          })
          .finally(() => this.loading = false)
      })
    },
  }
}
</script>

<style lang='less' scoped>
.login-page {
  background-color: #283443;
  height: 100%;
  color: #fff;
  overflow: hidden;
}

.login-form {
  width: 420px;
  position: relative;
  top: 150px;
  margin: auto auto;
  text-align: center;

  h3 {
    font-size: 2em;
    line-height: 2em;
    font-weight: bold;
  }

  p {
    color: #fff4;
    margin-bottom: 1em;
  }
}
</style>

<style lang="less">
.login-form {
  .el-input {
    display: inline-block;
    height: 42px;

    input {
      height: 42px;
      color: #fff;
      background: transparent;
      border-radius: 2px;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
