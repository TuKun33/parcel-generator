import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import './style.less';

const slideItem = {
  props: {
    itemData: Object,
    renderContent: Function
  },
  render(h) {
    return this.renderContent(h, this.itemData)
  }
}

var inited = false
const winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export default {
  name: 'effect-swiper',
  template: /*html*/`
    <nswiper v-if="options" :options="options" ref="mySwiper">
      <swiper-slide v-for="(item, i) in datas" :key="i">
        <div :class="hostClass">
          <slide-item :item-data="itemData(item , i)" :render-content="renderItem" ></slide-item>
        </div>
      </swiper-slide>
    </nswiper>
  `,
  components: {
    nswiper: swiper, swiperSlide, slideItem
  },
  props: {
    hostClass: {
      type: String,
      default: 'lesson'
    },
    active: Number,
    datas: Array,
    renderItem: Function,
    swiperOption: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      options: null
    }
  },
  created() {
    const _this = this
    this.options = {
      initialSlide: _this.active,
      effect: 'coverflow',
      loop: false,
      // slidesPerView: 0.96,
      slidesPerView: winWidth <= 760 ? 0.94 : (winWidth <= 1024 ? 1.35 : 1.46),
      spaceBetween: 0,
      centeredSlides: true,
      centerInsufficientSlides: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 20,
        depth: 200,
        modifier: 1,
        slideShadows : false,
      },
      on: {
        init() {
          inited = true
          _this.handleSlideInit(this.activeIndex)
          console.log('inited')
        },
        slideChange() {
          if (inited) {
            console.log('changed')
            _this.handleSlideChange(this.activeIndex)
          }
        },
        // slideChangeTransitionEnd: _this.handleSlideChange
      },
      ...this.swiperOption
    }

    // console.log(this.active)
    // console.log(this.datas)
    // console.log(this.renderItem)
  },
  computed: {
    swiper() {
      return this.$refs['mySwiper'].swiper
    }
  },
  methods: {
    itemData(item, i) {
      return { ...item, $index: i }
    },
    handleSlideInit(activeIndex) {
      this.$emit('inited', activeIndex)
    },
    handleSlideChange(activeIndex) {
      this.$emit('change', activeIndex)
    }
  }
}