<!-- 表单详情-drawer弹框 -->

<template>
  <el-drawer v-loading="loading" :title="formData?.name" :visible.sync="visible" size="540px">
    <dl>
      <dt>创建时间：</dt>
      <dd>{{formatTime(formData?.createTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</dd>

      <dt>更新时间：</dt>
      <dd>{{formatTime(formData?.lastTime,'{y}-{m}-{d} {h}:{i}:{s}')}}</dd>
    </dl>
  </el-drawer>
</template>

<script>
import { getList, getById, saveOrUpdate, deleteById } from '@/api/user.js'
import { detail } from '@/mixins/crud.js'
import { enumUse, enumGender } from '@/model/enums'

export default {
  name: 'UserDetail',
  mixins: [detail],
  data() {
    return {
      enumUse,
      enumGender,
    }
  },
  methods: {
    getById
  }

}
</script>
