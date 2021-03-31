import './toast.less';
import * as dom from '../../utils/dom'

var Toast = {};
//避免重复install，设立flag
Toast.installed = false;
Toast.install = function (Vue, options = {}) {
   if (Toast.installed) return;
   const defaultOption = {
      // 默认显示位置
      type: "center",
      // 默认持续时间, 小于0 永不消失
      duration: 3000
   }

   Vue.prototype.$toast = (text, _options = {}) => {
      options = {
         ...defaultOption,
         ...options,
         ..._options
      }
      if (!['bottom', 'top', 'center'].includes(options.type)) {
         options.type = 'center'
      }
      // 如果页面有toast则不继续执行
      if (dom.ele('.vue-toast')) return;
      // 1、创建构造器，定义好提示信息的模板
      let toastTip = Vue.extend({
         template: `
        <div class="vue-toast tip-${options.type}">
           <div class="vue-tip fadeIn">${text}</div>
        </div>
       `
      });
      // 2、创建实例，挂载到文档以后的地方
      let tpl = new toastTip().$mount().$el;
      // 3、把创建的实例添加到body中
      document.body.appendChild(tpl);
      // 4.移除
      if (options.duration > 0) {
         setTimeout(() => {
            dom.removeClass(dom.ele(".vue-toast .vue-tip"), 'fadeIn')
            dom.addClass(dom.ele(".vue-toast .vue-tip"), 'fadeOut')
            setTimeout(() => {
              try {
                dom.ele('.vue-toast') && document.body.removeChild(tpl)
              } catch (e) {}
            }, 300)
         }, options.duration);
      }
      //阻止遮罩滑动
      dom.on(dom.ele("div.vue-toast"), 'touchmove', e => {
         e.stopPropagation();
         e.preventDefault();
      })
      Toast.installed = true;
   };

   Vue.prototype.$toast.close = _ => {
    if (!dom.ele('.vue-toast')) return;
    dom.removeClass(dom.ele(".vue-toast .vue-tip"), 'fadeIn')
    dom.addClass(dom.ele(".vue-toast .vue-tip"), 'fadeOut')

    return new Promise(resolve => {
      setTimeout(() => {
        if (dom.ele('.vue-toast')) {
          try {
            document.body.removeChild(dom.ele('.vue-toast'))
          } catch (e) {}
        }
        resolve()
      }, 300)
    })
   }
   // 显示不同的位置
   // ['bottom', 'top', 'center'].forEach(type => {
   //    Vue.prototype.$toast[type] = tips => {
   //       return Vue.prototype.$toast(tips, { type })
   //    }
   // })
};

export default Toast