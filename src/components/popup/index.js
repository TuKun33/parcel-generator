import './style.less'
import Popup from './popup'
import * as dom from '../../utils/dom'

export default {
   template: `
      <transition
         :name="'vux-popup-animate-' + position">
         <div
         v-show="show && !initialShow"
         :style="styles"
         class="vux-popup-dialog"
         :class="['vux-popup-' + position, show ? 'vux-popup-show' : '']">
            <slot v-if="shouldRenderBody"></slot>
         </div>
      </transition>
   `,
   props: {
      value: Boolean,
      height: {
         type: String,
         default: 'auto'
      },
      width: {
         type: String,
         default: 'auto'
      },
      showMask: {
         type: Boolean,
         default: true
      },
      isTransparent: Boolean,
      hideOnBlur: {
         type: Boolean,
         default: true
      },
      position: {
         type: String,
         default: 'bottom'
      },
      maxHeight: String,
      popupStyle: Object,
      hideOnDeactivated: {
         type: Boolean,
         default: true
      },
      shouldRerenderOnShow: {
         type: Boolean,
         default: false
      },
      shouldScrollTopOnShow: {
         type: Boolean,
         default: false
      }
   },
   mounted() {
      this.$overflowScrollingList = document.querySelectorAll('.vux-fix-safari-overflow-scrolling')
      this.$nextTick(() => {
         const _this = this
         this.popup = new Popup({
            showMask: _this.showMask,
            container: _this.$el,
            hideOnBlur: _this.hideOnBlur,
            onOpen() {
               _this.fixSafariOverflowScrolling('auto')
               _this.show = true
            },
            onClose() {
               _this.show = false
               if (window.__$vuxPopups && Object.keys(window.__$vuxPopups).length > 1) return
               if (document.querySelector('.vux-popup-dialog.vux-popup-mask-disabled')) return
               setTimeout(() => {
                  _this.fixSafariOverflowScrolling('touch')
               }, 300)
            }
         })
         if (this.value) {
            this.popup.show()
         }
         this.initialShow = false
      })
   },
   deactivated() {
      if (this.hideOnDeactivated) {
         this.show = false
      }
      this.removeModalClassName()
   },
   methods: {
      /**
       * https://github.com/airyland/vux/issues/311
       * https://benfrain.com/z-index-stacking-contexts-experimental-css-and-ios-safari/
       */
      fixSafariOverflowScrolling(type) {
         if (!this.$overflowScrollingList.length) return
         // if (!/iphone/i.test(navigator.userAgent)) return
         for (let i = 0; i < this.$overflowScrollingList.length; i++) {
            this.$overflowScrollingList[i].style.webkitOverflowScrolling = type
         }
      },
      removeModalClassName() {
         this.layout === 'VIEW_BOX' && dom.removeClass(document.body, 'vux-modal-open')
      },
      doShow() {
         this.popup && this.popup.show()
         this.$emit('on-show')
         this.fixSafariOverflowScrolling('auto')
         this.layout === 'VIEW_BOX' && dom.addClass(document.body, 'vux-modal-open')
         if (!this.hasFirstShow) {
            this.$emit('on-first-show')
            this.hasFirstShow = true
         }
      },
      scrollTop() {
         this.$nextTick(() => {
            this.$el.scrollTop = 0
            const box = this.$el.querySelectorAll('.vux-scrollable')
            if (box.length) {
               for (let i = 0; i < box.length; i++) {
                  box[i].scrollTop = 0
               }
            }
         })
      }
   },
   data() {
      return {
         layout: '',
         initialShow: true,
         hasFirstShow: false,
         shouldRenderBody: true,
         show: this.value
      }
   },
   computed: {
      styles() {
         const styles = {}
         if (!this.position || this.position === 'bottom' || this.position === 'top') {
            styles.height = this.height
         } else {
            styles.width = this.width
         }
         if (this.maxHeight) {
            styles['max-height'] = this.maxHeight
         }
         this.isTransparent && (styles['background'] = 'transparent')
         if (this.popupStyle) {
            for (let i in this.popupStyle) {
               styles[i] = this.popupStyle[i]
            }
         }
         return styles
      }
   },
   watch: {
      value(val) {
         this.show = val
      },
      show(val) {
         this.$emit('input', val)
         if (val) {
            // rerender body
            if (this.shouldRerenderOnShow) {
               this.shouldRenderBody = false
               this.$nextTick(() => {
                  this.scrollTop()
                  this.shouldRenderBody = true
                  this.doShow()
               })
            } else {
               if (this.shouldScrollTopOnShow) {
                  this.scrollTop()
               }
               this.doShow()
            }
         } else {
            this.$emit('on-hide')
            this.show = false
            this.popup.hide(false)
            setTimeout(() => {
               if (!document.querySelector('.vux-popup-dialog.vux-popup-show')) {
                  this.fixSafariOverflowScrolling('touch')
               }
               this.removeModalClassName()
            }, 200)
         }
      }
   },
   beforeDestroy() {
      this.popup && this.popup.destroy()
      this.fixSafariOverflowScrolling('touch')
      this.removeModalClassName()
   }
}