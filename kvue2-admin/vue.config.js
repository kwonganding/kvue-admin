const { defineConfig, } = require("@vue/cli-service")
const defaultSettings = require('./src/settings.js')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = defineConfig({
  //基本url，多用于指定子路径，同process.env.BASE_URL
  publicPath: process.env.BASE_URL,
  // 是否编译生成map文件，map文件主要是为了调试定位使用，可根据环境来调整开启策略
  productionSourceMap: false,

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
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,    // 关闭提前注释到单独文件，配置“terser-webpack-plugin”插件
        })
      ],
      splitChunks: {                 // 开启分离js
        chunks: "all",               //async异步代码分割 initial同步代码分割 all同步异步分割都开启
        minSize: 30000,              //字节 引入的文件大于30kb才进行分割
        automaticNameDelimiter: '-', //缓存组和生成文件名称之间的连接符
        // name: true,                  //缓存组里面的filename生效，覆盖默认命名
        cacheGroups: {               //按组件模块分割
          "element-ui": {
            name: 'eu',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: 10,
          },
          "vue": {
            name: 'vue',
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            priority: 20,
          },
          "axios": {
            name: 'axios',
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            priority: 20,
          },
          "echarts": {
            name: 'echarts',
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: 20,
          },
        },
      },
    }
  },

  // 第三方插件选项
  pluginOptions: {

  },
})
