// crud 列表页面的复用代码

import { formatTime } from "@/utils/date"

/**
 * crud 通用列表处理-mixin
 */
export const list = {
  data() {
    return {
      loading: false,
      query: {         // 分页查询对象query
        pageIndex: 1,
        pageSize: 20,
        orderBy: '',
        sortOrder: '', // ASC/DESC
      },
      dataList: {      // 服务端返回的分页数据对象
        list: [],      // 列表数据
        total: 0,      // 总数量，用于分页
      },
    }
  },
  methods: {
    // 常用的时间格式化
    formatTime,
    // 接口（待覆盖）：获取列表数据
    getList() { },
    // 接口（待覆盖）：根据id删除数据，id支持多个
    deleteById() { },

    // 虚方法（按需实现）：加载数据后执行的动作
    afterLoadData() { },

    /**
     * 加载页面数据
     */
    loadData() {
      this.loading = true
      this.getList(this.query)
        .then(data => {
          this.dataList = data.data
          this.afterLoadData()
        }).finally(() => this.loading = false)
    },

    /**
     * 执行搜索，页码归1
     */
    onSearch() {
      this.query.pageIndex = 1
      this.loadData()
    },

    /**
     * 处理表格的排序事件，加载数据
     */
    handleSortChange(sort) {
      if (!sort.order) {
        this.query.orderBy = this.query.sortOrder = null
      }
      else {
        this.query.orderBy = sort.prop
        this.query.sortOrder = sort.order == 'ascending' ? "ASC" : "DESC"
      }
      this.loadData()
    },

    /**
     * 删除选中项的主键，支持多个，多个逗号隔开
     */
    handleDelete(ids) {
      if (!ids) return
      this.$confirm.warning(`确定要删除所选数据[${ids}]吗？删除后将无法恢复，请再次确认！`, "删除提醒").then(() => {
        this.loading = true
        this.deleteById(ids).then((data) => {
          this.$message.success(data.message)
          this.loadData()
        }).finally(() => this.loading = false)
      }).catch(() => { this.$message.info("取消删除！") })
    },
  },
}


/**
 * crud 通用表单处理-mixin
 */
export const form = {
  data() {
    return {
      loading: false,     //页面数据加载状态
      saveLoading: false, //保存状态
      // 标题
      title: '',
      // 存储当前对象form数据
      formData: {},
      formRules: {},
      keyId: null,   // 主键id值，可据此判断新增、修改
      // 是否全屏
      fullscreen: false,
      // 是否显示
      visible: false,
    }
  },
  methods: {
    // 常用的时间格式化
    formatTime,
    // 接口（待覆盖）：根据id获取数据
    getById() { },
    // 接口（待覆盖）：更新数据
    saveOrUpdate() { },

    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen() { },

    // 保存前的动作，返回bool，false则不执行保存
    beforeSave() {
      return true
    },

    // 打开窗口，获取最新数据
    open(id) {
      this.visible = true
      this.keyId = id
      this.title = id ? "修改" : "新建"
      if (!this.keyId) {
        this.afterOpen()
        return
      }
      // 获取最新数据
      this.loading = true
      this.getById(this.keyId)
        .then(res => {
          this.formData = res.data
          this.afterOpen()
        })
        .finally(() => this.loading = false)
    },

    // 执行保存
    save() {
      if (!this.beforeSave())
        return
      this.$refs.form.validate((valid, mes) => {
        if (!valid) {
          this.$message.error('输入有误，请修改后重新提交！')
          return
        }
        this.saveLoading = true
        this.saveOrUpdate(this.formData)
          .then(res => {
            this.$message.success(res.message)
            this.afterSave()
          })
          .finally(() => { this.saveLoading = false })
      })
    },

    // 更新后操作，关闭、更新
    afterSave() {
      this.close()
      this.$emit('updated')
    },
    // 关闭
    close() {
      this.visible = false
    },
  },
}


/**
 * crud 通用详情面板-mixin
 */
export const detail = {
  data() {
    return {
      loading: false,     //页面数据加载状态
      // 存储当前对象form数据
      formData: {},
      // 是否显示
      visible: false,
    }
  },
  methods: {
    // 常用的时间格式化
    formatTime,
    // 接口（待覆盖）：根据id获取数据
    getById() { },

    // 虚方法（按需实现）：弹窗加载后执行
    afterOpen() { },

    // 打开窗口，获取最新数据
    open(id) {
      this.visible = true
      // 获取最新数据
      this.loading = true
      this.getById(this.keyId)
        .then(res => {
          this.formData = res.data
          this.afterOpen()
        })
        .finally(() => this.loading = false)
    },
    // 关闭
    close() {
      this.visible = false
    },
  },
}
