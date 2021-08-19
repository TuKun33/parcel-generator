const Bundler = require('parcel-bundler');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const env = require('./env');
const config = require('./build');
const vueDevtoolsScript = '<script src="http://localhost:8098"></script>';
const { deleleDirAll, getProcessArgs } = require('./utils')

const args = getProcessArgs();

// 直接从npm命令里取参数
const npmArgvs = JSON.parse(process.env.npm_config_argv).original;
// 是否是开发环境
const dev = args.hasOwnProperty('--dev') || args.hasOwnProperty('-D') || npmArgvs.includes('--dev') || npmArgvs.includes('-D');
env.set(dev)

const inputpath = args['input'] || args['i'] // pages/下的页面路径名: distribute
const outputpath = args['output'] || args['o'] || inputpath

if (!inputpath) {
  console.error('[BUILD ERROR] `input` or `i` cannot be empty for cli args!')
  // return;
}

if (dev) {
  
  require('./proxy/app.js')();

  const command = inputpath
    ? `parcel src/pages/${inputpath}/index.html -d dist/${outputpath} --no-cache --port ${config.devServer.port}`
    : `parcel src/pages/**/index.html -d dist/** --no-cache --port ${config.devServer.port}`;

  // starting vue-devtools
  const indexHtml = path.join(config.input.baseDir, inputpath, 'index.html');
  const indexHtmlContent = fs.readFileSync(indexHtml, 'utf8');
  if (!indexHtmlContent.includes(vueDevtoolsScript)) {
    // fs.appendFileSync(indexHtml, vueDevtoolsScript);
    fs.writeFileSync(indexHtml, indexHtmlContent.replace('<head>', `<head>${vueDevtoolsScript}`))
  }
  exec('vue-devtools', {});

  spawn(command, {
    shell: true, stdio: 'inherit'
  });
  
  // worker.stdout && worker.stdout.on('data', function (data) {
  //   console.log(data);
  // });
  // worker.stderr && worker.stderr.on('data', function (data) {
  //   console.error(data);
  // });
  // worker.error && worker.error.on('data', function (data) {
  //   console.error(data);
  // });

  return;
}

const outFilename = config.input.filename || 'index.html'

const entryFiles = path.join(config.input.baseDir, inputpath, outFilename)
// console.log('building: ', entryFiles)
const outDir = path.join(config.output.baseDir, outputpath)

// 清空输出目录
!dev && deleleDirAll(outDir)
console.log(process.env.NODE_ENV)
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
  scopeHoist: false, //!dev,
}

fs.writeFileSync(entryFiles, fs.readFileSync(entryFiles, 'utf-8').replace(vueDevtoolsScript, ''));

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
  bundler.serve(config.devServer.port || 1234);
}