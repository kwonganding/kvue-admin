<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDialog
    :title="title+'字典数据'"
    width="600px"
    top="10vh"
    @save="save"
    @close="close"
    :save-loading="saveLoading"
    :is-modified="isModified"
    :visible.sync="visible"
  >
    <!-- form表单 -->
    <el-form v-loading="loading" ref="form" :model="formData" :rules="formRules" label-width="80px" label-suffix="：">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="formData.name" maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model.trim="formData.code" maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item label="父级" prop="pid" v-show="isTree">
        <TreeSelect :data="dataTree" v-model="formData.pid" clearable :only-leaf="false"></TreeSelect>
      </el-form-item>

      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model.number="formData.orderNum" :precision="2" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio border v-for="e in enumState.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </FormDialog>
</template>

<script>
import { form } from '@/mixins/crud.js'
import FormDialog from '@/components/FormDialog.vue'
import TreeSelect from '@/components/TreeSelect.vue'

import { getList, getById, saveOrUpdate, deleteById } from '@/api/dict-data.js'
import { getDictData } from '@/api/dict.js'

import { enumState } from '@/model/enums'
import { list2Tree, setTreeDisable } from '@/utils/tree'

export default {
  name: 'DictDataForm',
  components: { FormDialog, TreeSelect },
  mixins: [form],
  data() {
    return {
      enumState,
      pid: undefined,  // 父级id，缓存一下
      dict: {},     // 所属的字典类型对象
      dataTree: [], //树形结构的字段数据，树级结构才需要加载
      formRules: {
        name: [{ required: true, message: '必填' }],
      },
    }
  },
  computed: {
    isTree() {
      return this.dict?.isTree ?? false
    }
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（必须实现）：创建一个空的表单对象
    newFromData() {
      return {
        name: undefined,
        code: undefined,
        orderNum: 1,
        type: '',
        pid: 0,
        state: enumState.values[0].key,
      }
    },

    // 虚方法（按需实现）：弹窗加载前执行
    // 每次加载部门数据
    beforeOpen([dict, pid]) {
      this.dict = dict
      this.pid = pid

      if (!this.isTree) return

      getDictData(this.dict.type).then(res => {
        const list = res.data
        this.dataTree = list2Tree(list)

        // 修改时，不能选择自己及后代
        if (this.keyId)
          setTreeDisable(this.dataTree, list.filter(s => s.id === this.keyId)?.[0])

        // 再次更新pid
        // 指定父级
        if (!this.keyId) { //新增
          this.$nextTick(() => {
            this.formData.pid = this.pid
          })
        }
      })
    },

    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen() {
      if (this.pid && !this.keyId)
        this.formData.pid = this.pid
      this.formData.type = this.dict.type
    },
  }
}
</script>
