<!-- 表单编辑-dialog弹框 -->
<template>
  <FormDialog
    :title="title+'菜单资源'"
    width="860px"
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
          <el-form-item label="标题名称" prop="title">
            <el-input v-model.trim="formData.title" maxlength="32" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资源编码" prop="name">
            <template slot="label">
              <span>
                资源编码
                <el-tooltip class="item" effect="dark" placement="right">
                  <i class="el-icon-question" style="vertical-align: middle;"></i>
                  <div slot="content">
                    资源项的英文编码，建议小写，不同资源类型的含义：
                    <p>● catalog（目录）：作为path路径的一部分，如“users”，只能在目录下</p>
                    <p>● menu(视图菜单)：必须和组件的name一致，如“user”，只能在目录下</p>
                    <p>● button(按钮)：按钮权限的Key值，如“add”、delete”，只能在菜单项下面，自己不能再有子级。</p>
                  </div>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model.trim="formData.name" maxlength="32" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="资源类型" prop="type">
            <el-radio-group v-model="formData.type">
              <el-radio-button v-for="e in enumPermission.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType" v-show="isMenu">
            <template slot="label">
              <span>
                菜单类型
                <el-tooltip class="item" effect="dark" placement="right">
                  <i class="el-icon-question" style="vertical-align: middle;"></i>
                  <div slot="content">
                    类型为菜单时有效：
                    <p>选项卡（default）：默认值，资源地址（view）值为组件路径</p>
                    <p>外接（link）：资源地址（view）值为http地址，新标签打开</p>
                    <p>内链（iframe）：资源地址（view）值为http地址，内部iframe打开</p>
                  </div>
                </el-tooltip>
              </span>
            </template>
            <el-radio-group v-model="formData.menuType">
              <el-radio-button v-for="e in enumMenuType.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上级" prop="pid">
            <TreeSelect
              :data="treeList"
              :option="{ value: 'id', label: 'title', children: 'children' }"
              v-model="formData.pid"
              clearable
              :only-leaf="false"
            ></TreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号" prop="orderNum">
            <el-input-number v-model.number="formData.orderNum" :precision="2" :step="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="图标Icon" prop="icon">
            <IconSelect v-model="formData.icon"></IconSelect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资源地址" prop="view" v-show="isMenu">
            <template slot="label">
              <span>
                资源地址
                <el-tooltip class="item" effect="dark" placement="right">
                  <i class="el-icon-question" style="vertical-align: middle;"></i>
                  <div slot="content">
                    组件（资源）地址，示例：views/system/user，“view”开头
                    <p>如果是链接（内链、外链），则为链接URL地址，http开头</p>
                  </div>
                </el-tooltip>
              </span>
            </template>

            <el-input v-model.trim="formData.view" maxlength="256" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="路由路径" prop="path" v-show="isMenu">
            <template slot="label">
              <span>
                路由路径
                <el-tooltip class="item" effect="dark" placement="right">
                  <i class="el-icon-question" style="vertical-align: middle;"></i>
                  <div slot="content">
                    类型为菜单时有效：作为路由注册地址，会递归包含父级name
                    <p>可为空：默认使用编码代替</p>
                    <p>设置动态路径参数才需要设置，如“user/:id”</p>
                  </div>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model.trim="formData.path" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="导航路径" prop="nav" v-show="isMenu">
            <template slot="label">
              <span>
                导航路径
                <el-tooltip class="item" effect="dark" placement="right">
                  <i class="el-icon-question" style="vertical-align: middle;"></i>
                  <div slot="content">菜单的导航URL地址，默认不用设置（用编码值），只有设置了动态路由时才需要明确设置导航地址，如“user/1”</div>
                </el-tooltip>
              </span>
            </template>
            <el-input v-model.trim="formData.nav" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="是否显示" prop="visible">
            <template slot="label">
              <span>
                是否显示
                <el-tooltip class="item" effect="dark" placement="right">
                  <i class="el-icon-question" style="vertical-align: middle;"></i>
                  <div slot="content">设置是否显示到导航菜单中</div>
                </el-tooltip>
              </span>
            </template>
            <el-radio-group v-model="formData.visible">
              <el-radio-button :key="1" :label="1">显示</el-radio-button>
              <el-radio-button :key="0" :label="0">隐藏</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否缓存" prop="cache">
            <el-radio-group v-model="formData.cache">
              <el-radio-button :key="1" :label="1">是</el-radio-button>
              <el-radio-button :key="0" :label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="formData.state">
              <el-radio-button v-for="e in enumState.values" :key="e.key" :label="e.key">{{ e.text }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

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
import IconSelect from "@/components/IconSelect"

import { getList, getById, saveOrUpdate } from '@/api/permission.js'
import { enumState, enumPermission, enumMenuType } from '@/model/enums'
import { list2Tree, setTreeDisable } from '@/utils/tree'

export default {
  name: 'DepartmentForm',
  components: { FormDialog, TreeSelect, IconSelect },
  mixins: [form],
  data() {
    return {
      enumState, enumPermission, enumMenuType,
      treeList: [], // 树
      parent, undefined, // 父级对象，用于设置pid、以及默认的资源类型
      formRules: {
        title: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        orderNum: [{ type: 'number', message: '数字值' }],
      },
    }
  },
  computed: {
    isMenu() {
      return this.formData.type === 'menu'
    }
  },
  methods: {
    getById, saveOrUpdate,

    // 虚方法（必须实现）：创建一个空的表单对象
    newFromData() {
      return {
        title: undefined,
        name: undefined,
        pid: 0,
        orderNum: 1,
        type: enumPermission.values[0].key,
        icon: '',
        menuType: enumMenuType.values[0].key,
        path: undefined,
        nav: undefined,
        view: undefined,
        visible: 1,
        cache: 1,
        remark: undefined,
        state: enumState.values[0].key,
      }
    },

    // 虚方法（按需实现）：弹窗加载前执行
    // 每次加载资源列表
    beforeOpen([parent]) {
      this.parent = parent
      // 只有目录、菜单
      getList({ type: ['catalog', 'menu'] }).then(res => {
        const list = res.data
        this.treeList = list2Tree(list)

        // 修改时，不能选择自己及后代
        if (this.keyId)
          setTreeDisable(this.departments, list.filter(s => s.id === this.keyId)?.[0])
        // 指定父级
        if (!this.keyId) { //新增
          this.$nextTick(() => {
            this.formData.pid = this.parent?.id
          })
        }
      })
    },
    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen() {
      // 指定父级
      if (!this.keyId) { //新增
        this.formData.pid = this.parent?.id
      }
      // 根据父节点处理默认值
      if (this.parent) {
        switch (this.parent.type) {
          case 'catalog':
            this.formData.type = 'menu'
            break
          case 'menu':
            this.formData.type = 'button'
            break
        }
      }
    },
  }
}
</script>
