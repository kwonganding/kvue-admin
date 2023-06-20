// ESLint插件的配置，需要VSCode中安装相应插件
module.exports = {
  "root": true,
  "env": {
    "node": true,
    'browser': true,
  },
  // extends引用第三方配置
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  "parserOptions": {
    "parser": "@babel/eslint-parser",
  },
  // ESLint规则
  // error（报错）、warn（警告），of（关闭）,  // always（始终启用）、never（不启用）
  "rules": {
    // 没有使用的变量只警告，不报错
    "vue/no-unused-vars": "warn",
    "no-unused-vars": "warn",
    "no-unreachable": "warn",

    // 禁用不必要的转义字符，转为警告吧
    "no-useless-escape": "warn",
    // 不允许Object.prototype直接从对象调用方法，转为警告吧
    "no-prototype-builtins": "warn",

    // 关闭驼峰命名规则
    "vue/multi-word-component-names": 0,
  },
}
