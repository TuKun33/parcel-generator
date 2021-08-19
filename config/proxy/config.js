module.exports = {
  // 代理服务端口
  port: 4321,
  // 需要代理的 { 接口前缀 : 目标域名 }
  proxyTable: {
		'/capi'  	: 'http://clockin.viowork.com/'
  }
}