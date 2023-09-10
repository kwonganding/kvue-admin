<!-- 表单详情-drawer弹框 -->

<template>
  <el-drawer :visible.sync="visible" size="540px" append-to-body>
    <span slot="title">
      <i :class="$route.meta.icon" style="font-size:16px"></i>&nbsp;用户-信息
    </span>

    <dl class="dl-blueline" v-loading="loading">
      <dt>编号ID：</dt>
      <dd>{{ data.id }}</dd>
      <br />

      <dt>用户名：</dt>
      <dd>{{ data.name }}</dd>
      <br />

      <dt>昵称：</dt>
      <dd>{{ data.nickname }}</dd>
      <br />

      <dt>电话号码：</dt>
      <dd>{{ data.phone }}</dd>
      <br />

      <dt>邮箱地址：</dt>
      <dd>{{ data.email }}</dd>
      <br />

      <dt>所属部门：</dt>
      <dd>{{ data.departmentName }}</dd>
      <br />

      <dt>用户状态：</dt>
      <dd>
        <el-tag v-if="data.state" :type="enumState[data.state]?.type">{{ enumState[data.state]?.text }}</el-tag>
      </dd>
      <br />

      <dt>备注：</dt>
      <dd>{{ data.remark }}</dd>
      <br />

      <dt>创建时间：</dt>
      <dd>{{formatTime(data?.createTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</dd>
      <br />
      <dt>更新时间：</dt>
      <dd>{{formatTime(data?.lastTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</dd>
    </dl>
  </el-drawer>
</template>

<script>
import { detail } from '@/mixins/crud.js'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'

import { enumState } from '@/model/enums'

export default {
  name: 'Detail',
  mixins: [detail],
  data() {
    return {
      enumState,
    }
  },
  methods: {
    getById,
  }
}
</script>
