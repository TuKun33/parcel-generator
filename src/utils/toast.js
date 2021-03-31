import '../assets/toast.less';

var Toast = {};
//避免重复install，设立flag
Toast.installed = false;
Toast.install = function (Vue, options) {
   if (Toast.installed) return;
   let opt = {
      // 默认显示位置
      defaultType: "center",
      // 默认持续时间
      duration: 2000
   }
   // 使用options的配置
   Object.assign(opt, options)

   Vue.prototype.$toast = (toast, type) => {
      // 如果有传type，位置则设为该type
      var chooseType = type ? type : opt.defaultType;
      // 如果页面有toast则不继续执行
      if (document.querySelector('.vue-toast')) return;
      // 1、创建构造器，定义好提示信息的模板
      let toastTip = Vue.extend({
         template: `
        <div class="vue-toast tip-${chooseType}">
           <div class="vue-tip fadeIn">${toast}</div>
        </div>
       `
      });
      // 2、创建实例，挂载到文档以后的地方
      // console.log(new toastTip().$mount())
      let tpl = new toastTip().$mount().$el;
      // 3、把创建的实例添加到body中
      document.body.appendChild(tpl);
      // 4.三秒后移除
      setTimeout(() => {
         document.querySelector("div.vue-tip").setAttribute("class", `vue-tip tip-${chooseType} fadeOut`)
         setTimeout(() => {
            document.body.removeChild(tpl);
         }, 300)
      }, opt.duration);
      //阻止遮罩滑动
      document.querySelector("div.vue-toast").addEventListener("touchmove", function (e) {
         e.stopPropagation();
         e.preventDefault();
      });

      Toast.installed = true;

   };
   // 显示不同的位置
   ['bottom', 'top', 'center'].forEach(type => {
      Vue.prototype.$toast[type] = tips => {
         return Vue.prototype.$toast(tips, type)
      }
   })
};

export default Toast