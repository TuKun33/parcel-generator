import './style.less'

import navbar from '../navbar'
import BScroll from 'better-scroll'
// import BScroll from './bscroll.min'

var sliderVm;

const sliderWidth = document.documentElement.clientWidth || document.body.clientWidth || slider.clientWidth

import {
  addClass
} from '../../utils/dom'

export default {
  template: /* html */ `
    <div style='height:100%'>
      <navbar :fixed='true' :navs='navs' @change='handleNavChange' ref='navbar' :active='sliderActive' :slider-show='false'></navbar>
      
      <div class="bar" ref='bar'>
        <div class="bar-item" :style="{
          width: 'calc(100% / ' + navs.length + ')',
          transform: 'translate(' + (sliderActive * sliderWidth) / navs.length + 'px, 0px)'
        }"></div>
      </div>

      <div ref="slider" class="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot class='slider-item'>
              
            </slot>
        </div>
      </div>
    </div>
   `,
  components: {
    navbar
  },
  props: {
    navs: Array,
    active: Number
  },
  data() {
    return {
      sliderWidth,
      sliderActive: 0
    }
  },
  watch: {
    sliderActive(i) {
      this.$emit('change', i)
    }
  },
  created() {
    this.sliderActive = this.active
  },
  mounted() {
    this.containerInit()
  },
  methods: {
    containerInit() {
      if (sliderVm) sliderVm.destroy()

      this.$nextTick(() => {
        const {
          slider,
          sliderGroup,
          navbar
        } = this.$refs
        const sliderItems = sliderGroup.children

        slider.style.width = '100%'
        slider.style.height = `calc(100% - ${navbar.$el.clientHeight}px - 0.3rem)`
        slider.style.overflow = 'hidden'
        // for (let item of sliderItems) {
          
        // }
        for (var i = 0; i < sliderItems.length; i ++) {
          var item = sliderItems[i];
          item.style.width = sliderWidth + 'px'
          addClass(item, 'slider-item')
        }
        // Array.from(sliderItems).forEach(item => {
          
        // });

        sliderGroup.style.width = sliderItems.length * sliderWidth + 'px'

        // this.sliderWidth = sliderWidth
        sliderVm = new BScroll('.slider', {
          scrollX: true,
          scrollY: false,
          snap: {
            threshold: 0.3
          },
          momentum: false,
          stopPropagation: true,
          probeType: 3,
          eventPassthrough: 'vertical'
        })

        sliderVm.goToPage(this.sliderActive, 0, 0)

        if (!this.barInited) {
          this.$nextTick(_ => {
            setTimeout(_ => this.barInit(sliderVm), 0)
          })
        }
      })
    },

    barInit(sliderVm) {
      const bar = new BScroll('.bar', {
        startX: (this.sliderActive * sliderWidth) / this.navs.length,
        scrollX: true,
        scrollY: false,
        disableTouch: true,
      })
      
      // bar.goToPage(this.sliderActive, 0, 0)

      sliderVm.on('scroll', e => {
        // console.log(e.x)
        bar.scrollTo(-e.x / this.navs.length, 0)
        var i = sliderVm.getCurrentPage().pageX
        if (i !== this.sliderActive) {
          this.sliderActive = i
        }
      })

      this.barInited = true
    },
    handleNavChange(i) {
      this.sliderActive = i
      this.$nextTick(() => {
        sliderVm.goToPage(i, 0, 300)
      })
    },
  }
}