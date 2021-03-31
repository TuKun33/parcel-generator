import './style.less';
import { addClass, hasClass } from '../../utils/dom'

export default {
  template: /* html */ `
    <div :class='{ "navbar-fixed": fixed }'>
      <div class='navbar' ref='navbar'>
        <div class='navbar-item' 
          v-for='(item, i) in navs' :key='i'
          @click='handleNavClick(i)'
          :class='{ "active": activeIndex === i }'
        >
          <span class='navbar-item__title'>{{ item.title }}</span>
        </div>
        <div v-show='sliderShow' class='navbar-slider' ref='slider' 
          :style='{ 
            width: sliderWidth,
            left: sliderLeft + "px",
            transform: "translateX(" + sliderOffset + "px)"
          }'>
        </div>
      </div>
    </div>
   `,
  props: {
    navs: {
      type: Array,
      default () {
        return []
      }
    },
    fixed: {
      type: Boolean,
      default: false
    },
    active: {
      type: Number,
      default: 0
    },
    sliderWidth: {
      type: String,
      default: '3em'
    },
    sliderShow: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'active',
    event: 'change'
  },
  watch: {
    active(i) {
      // this.handleNavClick(i)
      this.activeIndex = i
    }
  },
  data() {
    return {
      navItemWidth: window.innerWidth / this.navs.length,
      activeIndex: 0,
      sliderLeft: 0
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    sliderOffset() {
      return this.navItemWidth * this.activeIndex
    }
  },
  methods: {
    init() {
      this.activeIndex = this.active
      this.navItemWidth = this.$refs['navbar'].offsetWidth / this.navs.length
      this.sliderLeft = (this.navItemWidth - this.$refs['slider'].offsetWidth) / 2
    },
    handleNavClick(i) {
      // 开启动画
      const slider = this.$refs['slider']
      const TRANSITION = 'slider-transition'
      if (!hasClass(slider, TRANSITION)) {
        addClass(slider, TRANSITION)
      }
      this.activeIndex = i
      this.$emit('change', i)
    },
  }
}