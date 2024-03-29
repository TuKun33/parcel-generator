import './style.less';
import BScroll from 'better-scroll';
import { addClass } from "../../utils/dom";

export default {
  // template: /*html*/ `
    
  // `,
  render(h) {
    const { dots, showDot } = this
    return (
      <div class="slide" ref="slide">
        <div class="slide-group" ref="slideGroup">
          { this.$slots.default }
        </div>
        { showDot ?
          <div class="dots">
            { dots.map((item, index) => <span class="dot" class={{ active: currentPageIndex === index }}></span>) }
          </div>
          : ''
        }
      </div>
    )
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    this.update()
    window.addEventListener('resize', () => {
      if (!this.slide || !this.slide.enabled) {
        return
      }
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  activated() {
    if (!this.slide) {
      return
    }
    this.slide.enable()
    let pageIndex = this.slide.getCurrentPage().pageX
    this.slide.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    this.slide.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    this.slide.disable()
    clearTimeout(this.timer)
  },
  methods: {
    update() {
      if (this.slide) {
        this.slide.destroy()
      }
      this.$nextTick(() => {
        this.init()
      })
    },
    refresh() {
      this._setSlideWidth(true)
      this.slide.refresh()
    },
    prev() {
      this.slide.prev()
    },
    next() {
      this.slide.next()
    },
    init() {
      clearTimeout(this.timer)
      this.currentPageIndex = 0
      this._setSlideWidth()
      if (this.showDot) {
        this._initDots()
      }
      this._initSlide()
      if (this.autoPlay) {
        this._play()
      }
    },
    _setSlideWidth(isResize) {
      this.children = this.$refs.slideGroup.children
      let width = 0
      let slideWidth = this.$refs.slide.clientWidth
      // window._children = this.children
      // for (let child of this.children) {
      //   addClass(child, 'slide-item')
      //   child.style.width = slideWidth + 'px'
      //   width += slideWidth
      // }
      const sliderItems = this.children
      for (var i = 0; i < sliderItems.length; i ++) {
        var child = sliderItems[i];
        addClass(child, 'slide-item')
        child.style.width = slideWidth + 'px'
        width += slideWidth
      }
      if (this.loop && !isResize) {
        width += 2 * slideWidth
      }
      this.$refs.slideGroup.style.width = width + 'px'
    },
    _initSlide() {
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        stopPropagation: true,
        click: this.click,
        probeType: this.probeType
      })
      this.slide.on('scrollEnd', this._onScrollEnd)
      this.slide.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
      // const _this = this
      // this.slide.on('scroll', function() {
      //   _this.$emit('on-scroll', ...arguments)
      // })
    },
    _onScrollEnd() {
      let pageIndex = this.slide.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slide.next()
      }, this.interval)
    }
  },
  watch: {
    loop() {
      this.update()
    },
    autoPlay() {
      this.update()
    },
    speed() {
      this.update()
    },
    threshold() {
      this.update()
    }
  }
}