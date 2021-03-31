import './assets/style.less';

import Vue from 'vue/dist/vue.esm';
import Index from './Index.vue';
import $http from '../../utils/http';
Vue.prototype.$http = $http
import $toast from '../../components/toast'
Vue.use($toast, { type: 'top' });

// import VueLazyload from 'vue-lazyload'
// import { LOAD_IMAGE } from '../../../components/imager/index_new';
// Vue.use(VueLazyload, {
//   loading: LOAD_IMAGE
// })

new Vue({
  el: '#app',
  render(h) {
    return h(Index)
  }
})