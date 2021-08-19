const fs = require('fs');
const path = require('path');
const { getProcessArgs } = require('./utils')

const jsTpl = 
`import '../../utils/Debug';
import Vue from 'vue/dist/vue.esm.js';

import $http from '../../utils/http';
Vue.prototype.$http = $http;

import $route from '../../mixins/route';
Vue.mixin($route);

import $toast from '../../components/toast';
Vue.use($toast, { type: 'top' });

import Index from './index.vue';
window.vm = new Vue({
  el: '#app',
  render(h) {
    return h(Index)
  }
});
`;

const htmlTpl = 
`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Clockin</title>
</head>

<body>
  <div id="app" v-cloak>
    
  </div>
  <script src="./index.js"></script>
</body>

</html>
`;

const args = getProcessArgs();
var pageName = args['p'] || args['page'];

if (!pageName) {
  console.error('missing arguments "p" or "page": node config/page.js p=PageName');
  process.exit();
}

const vueTpl = 
`<template>
  <div>
    
  </div>
</template>

<script>
export default {
  name: '${pageName}',
  data() {
    return {
      
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    
  },
}
</script>

<style lang="less">
@import './style.less';
</style>
`;

const lessTpl = `@import '../../assets/reset.less';`;
pageName = pageName.toLowerCase();
const targetPath = path.resolve(__dirname, `../src/pages/${pageName}`);

if (pageName && !fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath);
  fs.writeFile(`${targetPath}\\index.js`, jsTpl, err => {});
  fs.writeFile(`${targetPath}\\index.html`, htmlTpl, err => {});
  fs.writeFile(`${targetPath}\\index.vue`, vueTpl, err => {});
  fs.writeFile(`${targetPath}\\style.less`, lessTpl, err => {});
  
  const packageJson = require(path.resolve(__dirname, '../package.json'));
  packageJson.scripts[pageName] = 'node config/index i=' + pageName;
  fs.writeFile(path.resolve(__dirname, '../package.json'), JSON.stringify(packageJson, null, '\t'), err => {})
}