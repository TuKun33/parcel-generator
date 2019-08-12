
import Vue from 'vue/dist/vue.esm.js';
import Test from './components/Test.vue';
import Counter from './components/Counter.vue'
import store from './store'
console.log(store)

window.vm = new Vue({
  el: '#app',
  store,
  render(h) {
    return h(Counter)
  }
})