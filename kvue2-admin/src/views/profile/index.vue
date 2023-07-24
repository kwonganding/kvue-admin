<template>
  <div class="warpper">
    <el-card shadow="never">
      <template #header>
        <i class="icon el-icon-user"></i>
        <span>个人信息</span>
      </template>
      <el-form :model="userInfo" class="content" label-width="100px" label-suffix="：">
        <el-form-item label="头像">
          <img :src="baseURL + $store.getters.userInfo.avatar" alt="头像" width="100px" />
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{userInfo.name}}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-tag type="primary" v-for="tag in userInfo.role" v-once :key="tag" style="margin-right: 5px;">{{ tag }}</el-tag>
        </el-form-item>
        <el-form-item label="部门">
          <span>{{userInfo.name}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{userInfo.createTime}}</span>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userInfo.gender">
            <el-radio v-for="item in enumGender.entries" :key="item.key" :label="item.key">{{item.text}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="userInfo.gender" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <i class="iconfont icon-securityscan"></i>
        <span>修改密码</span>
      </template>
      <el-form :model="pwdInfo" class="content" label-width="100px" label-suffix="：">
        <el-form-item label="原有密码">
          <el-input v-model="pwdInfo.pwd" placeholder="输入原有密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwdInfo.npwd1" placeholder="输入新有密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="pwdInfo.npwd2" placeholder="输入新有密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
import { baseURL } from '@/utils/request'
import { enumGender } from '@/model/enums.js'

export default {
  name: 'profile',
  data() {
    return {
      baseURL,
      enumGender,
      userInfo: {
        name: 'anidng',
        role: ['超级管理员', 'role-ss'],
        department: '技术管理部',
        avatar: '',
        gender: 'female',
        sumary: '',
      },
      pwdInfo: {
        pwd: '',
        npwd1: '',
        npwd2: '',
      }
    }
  },
  methods: {
    getUserInfo() {
      getInfo().then(data => console.log(data)).catch(err => console.error(err))
    }
  }
}
</script>

<style lang='less' scoped>
.warpper {
  display: flex;
  flex-flow: row nowrap;
  .el-card {
    margin: 5px;
    flex: 1 1 50%;
  }
  .content {
    padding: 15px;
  }
}
</style>
