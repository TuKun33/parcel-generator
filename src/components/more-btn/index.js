import './index.less';
import $http from '../../utils/http';
import $route from '../../mixins/route'

export default {
  name: 'more-btn',
  template: /* html */`
    <div class="text-center fixed-bottom" style="margin-bottom:3rem;z-index:1000">
      <button class="btn-cicle" @click="navTo">{{ text }}</button>
    </div>
  `,
  props: {
    text: String,
    tickQuery: Object
  },
  methods: {
    navTo() {
      try {
        $http.get('/message/shareclick', this.tickQuery || $route.query)
      } catch (e) {}
      
      location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=cn.playstory.playplus'
    }
  }
}