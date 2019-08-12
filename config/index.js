const Bundler = require('parcel-bundler');
const path = require('path');
const exec = require('child_process').exec;
const env = require('./env');
const { deleleDirAll, getProcessArgs } = require('./utils')

const args = getProcessArgs()
// 是否是开发环境
const dev = args.hasOwnProperty('--dev') || args.hasOwnProperty('-D')
env.set(dev)

const inputpath = args['input'] || args['i'] // pages/下的页面路径名: distribute
const outputpath = args['output'] || args['o'] || inputpath

if (!inputpath) {
  console.error('[BUILD ERROR] `input` or `i` cannot be empty for cli args!')
  return;
}

if (dev) {
  const command = `parcel src/pages/${inputpath}/index.html -d dist/${outputpath} --no-cache`;
  exec(command, (error, stdout, stderr) => {
    console.error('error ', error)
    console.log('stdout ', stdout)
    console.error('stderr ', stderr)
  })
  return;
}

const config = require('./build')
const outFilename = config.input.filename || 'index.html'

const entryFiles = path.join(config.input.baseDir, inputpath, outFilename)
// console.log('building: ', entryFiles)
const outDir = path.join(config.output.baseDir, outputpath)

// 清空输出目录
!dev && deleleDirAll(outDir)
// console.log(process.env.NODE_ENV)
// console.log(outFilename,'\n', outDir)
// console.log(config)
// return; 
const options = {
  outDir,
  watch: dev,
  cache: false,
  contentHash: true,
  cacheDir: path.join(__dirname, '../.cache'),
  outFile: outFilename,
  publicUrl: config.output.publicUrl || (dev ? '/' : './'),
  minify: !dev,
  hmr: dev,
  sourceMaps: true,
  scopeHoist: !dev,
}

const bundler = new Bundler(entryFiles, options);

// bundler.on('buildStart', entryPoints => {
  
// });
bundler.on('bundled', (bundler) => {
  !dev && process.exit()
});
// 运行 bundler，这将返回主 bundle
// 如果你正在使用监听模式，请使用下面这些事件，这是因为该 promise 只会触发一次，而不是每次重新构建时都触发
const bundle = bundler.bundle();

if (dev) {
  bundler.serve(config.devServer.port || 1234)
}