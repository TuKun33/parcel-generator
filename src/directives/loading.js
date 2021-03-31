import * as dom from '../utils/dom'

export default {
   bind(el, binding) {
      if (binding.value) {
         dom.addClass(el, 'loading')
      }
   },
   update(el, binding) {
      if (!binding.value) {
         dom.removeClass(el, 'loading')
      } else {
         !dom.hasClass(el, 'loading') && dom.addClass(el, 'loading')
      }
   }
}