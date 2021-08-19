const app = require('express')();
const proxy = require('http-proxy-middleware');
const { port, proxyTable } = require('./config');

const proxyConfig = {
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,UPDATE,DELETE')
    // 如果前端有自定义的头，请添加
    res.header('Access-Control-Allow-Headers', 'token,X-Requested-With,Content-Type')
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    }
  },
  // onError: (err, req, res) => {
  //   // console.log(res)
  //   res.writeHead(500, {
  //     'Content-Type': 'text/plain'
  //   });
  //   res.end(
  //     'proxy server wrong'
  //   );
  // }
}

module.exports = _ => {
  Object.keys(proxyTable).forEach(prefix => {
    // Proxy
    app.use(prefix, proxy({
      target: proxyTable[prefix],
      ...proxyConfig
    }));
  })
  app.listen(port);
  console.log('Proxy server running at http://localhost:' + port)
}
