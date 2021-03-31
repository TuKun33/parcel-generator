import Validator from '../../utils/validator'

export default {
   template: /*html*/ `
      <span @click='handleVcodeGet' :style='enable.status && !sent && "color:#6A61E7"'>
         {{ !sent ? txt : sentText.replace('%s', interval + 's') }}
      </span>
   `,
   props: {
      mobile: {
         type: String,
         default: '',
      },
      text: {
         type: String,
         default: '获取验证码'
      },
      sentingText: {
         type: String,
         default: '请稍后...'
      },
      sentText: {
         // 约定使用一个 `%s` 来代替倒计时
         type: String,
         default: '%s'
      },
      reSendText: {
         type: String,
         default: '重新获取'
      }
   },
   data() {
      return {
         sent: false,      // 发送请求已成功
         senting: false,   // 发送请求等待响应
         interval: 60,     // 倒计时
         txt: ''         // 除倒计时该显示的文本
      }
   },
   computed: {
      enable() {
         return new Validator({
            mobile: this.mobile
         }, {
            mobile: ['required', 'tel'],
         }, {
            mobile: {
               required: '请填写正确的手机号',
               tel: '请填写正确的手机号'
            }
         })
      },
   },
   
   created() {
      this.txt = this.text
      localStorage.removeItem('validating')
   },
   methods: {
      /**
       * 获取验证码事件
       */
      handleVcodeGet() {
         const validator = this.enable
         if (!validator.status) {
            this.$toast(validator.errMsg)
         } else {
            if (!this.sent && !this.senting) {
               if (localStorage.validating) {
                  this.$toast('请稍后再试')
                  return
               }
               // 记录当前是否正在进行验证
               localStorage.validating = true
               this.senting = true;
               this.txt = this.sentingText;
               // 获取验证码请求
               this.$emit('send-request', state => {
                  this.senting = false
                  this.$toast(state.message)
                  if (state.success) {
                     this.sent = true
                     this.makeCountDown()
                  } else {
                     this.rollBack()
                  }
               })
            }
         }
      },
      
      makeCountDown() {
         this.timer = setInterval(() => {
            if (this.interval > 0) {
               this.interval -= 1;
            } else {
               this.rollBack();
            }
         }, 1000);
      },
      rollBack() {
         this.timer && clearInterval(this.timer);
         this.sent = false
         this.senting = false
         this.interval = 60
         this.txt = this.reSendText
         localStorage.removeItem('validating')
      },
   }

}