module.exports = {
  // 默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,
  env: {
    node: true,
    browser: true
  },
  globals: {
    uni: true,
    plus: true,
    wx: true,
    App: true,
    getApp: true,
    Page: true,
    getCurrentPages: true,
    Component: true,
    Behavior: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript',
    '@vue/prettier/@typescript-eslint'
  ],
  plugins: ['@typescript-eslint'], // 定义了该eslint文件所依赖的插件
  parserOptions: {
    // 解析器选项
    // 指定ESLint可以解析JSX语法
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    parser: '@typescript-eslint/parser' // 定义ESLint的解析器,才能正确的检测和规范TS代码
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': [
      1,
      {
        vars: 'all',
        args: 'none'
      }
    ],
    'space-before-function-paren': [0, 'never']
  }
}
