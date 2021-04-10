const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@/', resolve('src'))
    // 发行或运行时启用了压缩时会生效
    config.optimization.minimizer('terser').tap((args) => {
      const compress = args[0].terserOptions.compress
      // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
      compress.drop_console = true
      compress.pure_funcs = [
        '__f__' // App 平台 vue 移除日志代码
      ]
      return args
    })
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: resolve('public'), to: resolve('dist/build/h5') }
      ]) // 拷贝public里面的几个文件到打包目录
    ]
  }
}
