const path = require('path');
const { isDev } = require('./env')

module.exports = {
  input: {
    baseDir: path.join(__dirname, '../src/pages/'),
    filename: 'index.html',
  },
  output: {
    baseDir: path.join(__dirname, isDev() ? '../dist/' : '../build/'),
    publicUrl: isDev() ? '/' : './', // 静态资源相对 index.html 的路径
  },
  devServer: {
    port: 1234,
    proxyTable: {

    }
  }
}