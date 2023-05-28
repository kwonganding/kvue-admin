const { defineConfig, } = require("@vue/cli-service")
const defaultSettings = require('./src/settings.js')

module.exports = defineConfig({
  //默认false，是否需要转译的第三方依赖
  transpileDependencies: true,
  //基本url，多用于指定子路径，同process.env.BASE_URL
  publicPath: process.env.BASE_URL,
  // 并行构建
  parallel: true,

  // 调试环境配置
  devServer: {
    port: 8888,
    // 跨域代理
    proxy: {
      [process.env.VUE_APP_BASE_API]: { //用 “/api” 代理 target
        target: 'http://localhost:3000' + process.env.VUE_APP_BASE_API, //代理的目标
        changeOrigin: true,
        pathRewrite: { ['^' + process.env.VUE_APP_BASE_API]: '', },
      },
    },
  },

  // webpack配置
  configureWebpack: config => {
    config.name = defaultSettings.title
    config.optimization = {
      splitChunks: {                 // 开启分离js
        chunks: "all",               //async异步代码分割 initial同步代码分割 all同步异步分割都开启
        minSize: 30000,           //字节 引入的文件大于30kb才进行分割
        automaticNameDelimiter: '-', //缓存组和生成文件名称之间的连接符
        // name: true,               //缓存组里面的filename生效，覆盖默认命名
        cacheGroups: {               //按组件模块分割
          "element-ui": {
            name: 'eu',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: -10,
          },
          "vue": {
            name: 'vue',
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            priority: -10,
          },
          "axios": {
            name: 'axios',
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            priority: -10,
          },
          "echarts": {
            name: 'echarts',
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: -10,
          },
        },
      },
    }
  },

  // 第三方插件选项
  pluginOptions: {

  },
})
