
import Vue from 'vue/dist/vue.esm.js';
import Test from './components/Test.vue';

window.vm = new Vue({
  el: '#app',
  render(h) {
    return h(Test)
  }
})