<template>
  <div>
    <p style="color:var(--bg-color)">t1111111111</p>
    <input v-model="mes" />
    <el-button type="info" @click="findRule">set color</el-button>
    <el-tabs>
      <el-tab-pane label="t1111">
        <el-input v-model="mes" placeholder></el-input>
      </el-tab-pane>
      <el-tab-pane label="t222">
        <input type="text" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 't11',
  data() {
    return {
      mes: ''
    }
  },
  created() {
  },
  methods: {
    findRule() {
      // 设置全局变量
      const styles = document.styleSheets
      let rule = null
      for (let i = 0; i < styles.length; i++) {
        for (let j = 0; j < styles[i].cssRules.length; j++) {
          rule = styles[i].cssRules[j]
          if (rule.selectorText === 'html, body') {
            console.log('ok:', rule)
            break
          }
        }
      }
      rule.style.setProperty('--bg-color', this.mes)
      return
    }
  }
}
</script>


