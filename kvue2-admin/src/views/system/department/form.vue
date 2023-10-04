<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDialog
    :title="title+'组织'"
    width="700px"
    top="10vh"
    @save="save"
    @close="close"
    :save-loading="saveLoading"
    :is-modified="isModified"
    :visible.sync="visible"
  >
    <!-- form表单 -->
    <el-form v-loading="loading" ref="form" :model="formData" :rules="formRules" label-width="100px" label-suffix="：">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="formData.name" maxlength="32" clearable></el-input>
      </el-form-item>

      <el-form-item label="上级部门" prop="pid">
        <TreeSelect :data="treeList" v-model="formData.pid" clearable :only-leaf="false"></TreeSelect>
      </el-form-item>

      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model.number="formData.orderNum" :precision="2" :step="1"></el-input-number>
      </el-form-item>

      <el-form-item label="负责人" prop="manager">
        <el-input v-model.trim="formData.manager" maxlength="32" clearable></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio border v-for="e in enumState.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio>
        </el-radio-group>
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
import TreeSelect from '@/components/TreeSelect.vue'

import { getList, getById, saveOrUpdate } from '@/api/department.js'
import { enumState } from '@/model/enums'
import { list2Tree, setTreeDisable } from '@/utils/tree'

export default {
  name: 'DepartmentForm',
  components: { FormDialog, TreeSelect },
  mixins: [form],
  data() {
    return {
      enumState,
      treeList: [], // 部门集合树
      pid: undefined,  // 父级id，缓存一下
      formRules: {
        name: [{ required: true, message: '必填' }],
        orderNum: [{ type: 'number', message: '数字值' }],
      },
    }
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（必须实现）：创建一个空的表单对象
    newFromData() {
      return {
        name: undefined,
        pid: 0,
        orderNum: 1,
        manager: undefined,
        remark: undefined,
        state: enumState.values[0].key,
      }
    },

    // 虚方法（按需实现）：弹窗加载前执行
    // 每次加载部门数据，为了保证部门数据是最新的，只能辛苦每次都获取了
    beforeOpen([pid]) {
      getList().then(res => {
        const list = res.data
        this.treeList = list2Tree(list)
        // 修改时，不能选择自己及后代
        if (this.keyId)
          setTreeDisable(this.treeList, list.filter(s => s.id === this.keyId)?.[0])
        // 指定父级
        if (!this.keyId) { //新增
          this.$nextTick(() => {
            this.formData.pid = pid
          })
        }
      })
    },
    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen([pid]) {
      this.pid = pid
    },
  }
}
</script>
