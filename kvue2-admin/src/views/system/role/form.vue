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
        <el-tree
          ref="perTree"
          :data="treeList"
          show-checkbox
          default-expand-all
          multiple
          node-key="id"
          check-strictly
          @check="onCheckChange"
          :props="{label:'title',children:'children'}"
          style="width:100%;border:1px solid #0001"
        >
          <span :class="{'permission-button':data.type==='button'}" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
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
import { getPermissions } from '@/api/permission.js'
import { enumState } from '@/model/enums'
import { list2Tree, map, mapParent } from '@/utils/tree'

export default {
  name: 'RoleForm',
  components: { FormDrawer },
  mixins: [form],
  data() {
    return {
      enumState,
      treeList: undefined,
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
        perIds: [], // 授权信息集合
        remark: undefined,
        state: enumState.values[0].key,
      }
    },
    // 虚方法（按需实现）：弹窗加载前执行，参数为open方法的剩余参数
    beforeOpen() {
      if (this.treeList) return
      // 加载权限资源树
      getPermissions().then(res => {
        const list = res.data
        this.treeList = list2Tree(list)
        setTimeout(() => {
          this.setPerButtonStyle()
        }, 100)
      })
    },
    // 虚方法（按需实现）：弹窗加载后执行，参数为open方法的剩余参数
    afterOpen(args) {
      this.$refs.perTree.setCheckedKeys(this.formData.perIds)
    },
    // 设置按钮权限样式，横向显示
    setPerButtonStyle() {
      const doms = document.querySelectorAll('.permission-button')
      for (let i = 0; i < doms.length; i++) {
        doms[i].parentNode.style.cssText = 'float: left; padding-right: 20px;'
        doms[i].parentNode.parentNode.parentNode.style.marginLeft = '40px'
      }
    },
    // 保存前的动作，返回bool，false则不执行保存
    beforeSave() {
      this.formData.perIds = this.$refs.perTree.getCheckedKeys()
      return true
    },
    // check	当复选框被点击的时候触发
    // 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    onCheckChange(node, tree) {
      // 判断当前节点的状态
      const checked = tree.checkedKeys.includes(node.id)

      // 1、父节点：如果当前节点选中了，递归父节点选中
      if (checked) {
        const pids = mapParent(node, n => n.id)
        pids?.forEach(id => {
          this.$refs.perTree.setChecked(id, checked, false)
        })
      }
      ///2、子节点，同步子节点
      if (!node.children || node.children.length < 1)
        return
      // 手动实现父子单向联动
      const childrenIds = map(node.children, n => n.id)

      // 所有子节点同步
      childrenIds?.forEach(id => {
        this.$refs.perTree.setChecked(id, checked, false)
      })

    }
  }
}
</script>
