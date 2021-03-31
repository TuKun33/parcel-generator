import './style.less';
import * as dom from '../../utils/dom'

const BODY_CLASS_NAME = 'vux-modal-open'
const CONTAINER_CLASS_NAME = 'vux-modal-open-for-container'
const VIEW_BOX_ELEMENT = '#vux_view_box_body'

export default {
   template: /* html */`
   <div class="dialoger">
      <transition name="vux-mask">
         <div class="weui-mask" @click="hide" v-show="show" :style="maskStyle"></div>
      </transition>
      <transition name="vux-dialog">
         <div class="weui-dialog" v-show="show" :style='{ width: width, maxWidth: width }'>
            <slot></slot>
         </div>
      </transition>
   </div>
   `,
   model: {
      prop: 'show',
      event: 'change'
   },
   props: {
      show: {
         type: Boolean,
         default: false
      },
      maskZIndex: [String, Number],
      hideOnBlur: {
         type: Boolean,
         default: true
      },
      width: {
         type: String,
         default: '80%'
      }
   },
   computed: {
      maskStyle() {
         if (typeof this.maskZIndex !== 'undefined') {
            return {
               zIndex: this.maskZIndex
            }
         }
      }
   },
   watch: {
      show(val) {
         this.$emit('update:show', val)
         this.$emit(val ? 'on-show' : 'on-hide')
         if (val) {
            this.addModalClassName()
         } else {
            this.removeModalClassName()
         }
      }
   },
   methods: {
      addModalClassName() {
         if (this.shouldPreventScroll()) return

         dom.addClass(document.body, BODY_CLASS_NAME)
         dom.addClass(document.querySelector(VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME)
      },
      removeModalClassName() {
         dom.removeClass(document.body, BODY_CLASS_NAME)
         dom.removeClass(document.querySelector(VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME)
      },
      shouldPreventScroll() {
         // hard to get focus on iOS device with fixed position, so just ignore it
         const iOS = /iPad|iPhone|iPod/i.test(window.navigator.userAgent)
         const hasInput = this.$el.querySelector('input') || this.$el.querySelector('textarea')
         return iOS && hasInput
      },
      hide() {
         if (this.hideOnBlur) {
            this.$emit('update:show', false)
            this.$emit('change', false)
            this.$emit('on-click-mask')
         }
      }
   },
   beforeDestroy() {
      this.removeModalClassName()
   },
   deactivated() {
      this.removeModalClassName()
   }
}