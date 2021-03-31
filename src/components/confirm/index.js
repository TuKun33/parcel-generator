import './style.less';
import dialoger from '../dialoger'
// import * as dom from '../../utils/dom'

const Confirm = {}

Confirm.installed = false

Confirm.install = (Vue, options = {}) => {
  if (Vue.installed) return
  Vue.prototype.$confirm = (title = '', option = {}) => {
    option = {
      cancelText: '取消',
      confirmText: '确定',
      cancelColor: '#999',
      confirmColor: '#6A61E7',
      cancelShow: true,    // 显示取消按钮
      confirmShow: true,   // 显示确定按钮
      actionReverse: false,// 默认 右确定 左取消
      confirmClose: true,  // 确定按钮自动关闭
      ...option
    }
    return new Promise(resolve => {
        const ConfirmComp = Vue.extend({
          components: { dialoger },
          template: /* html */`
            <dialoger v-model='showDialog' :hide-on-blur='false' width='65%'>
              <div class='confirm'>
                <div class='confirm-body'>
                  <p>${ title }</p>
                </div>
                <div class='confirm-footer'>
                  <span v-for='(item, i) in actions' :key='i'
                    v-if='item.show'
                    @click='handleAction(item.confirm)'
                    :style='{ color: item.color}'>
                    {{ item.text }}
                  </span>
                </div>
              </div>
            </dialoger>
          `,
          data() {
              return {
                showDialog: false
              }
          },
          computed: {
              actions() {
                const actions = [
                    { text: option.cancelText, color: option.cancelColor, show: option.cancelShow, confirm: false }, // 取消
                    { text: option.confirmText, color: option.confirmColor, show: option.confirmShow, confirm: true }, // 确定
                ]
                // 翻转按钮
                return option.actionReverse ? actions.reverse() : actions
              }
          },
          methods: {
              handleAction(confirm) {
                this.showDialog = false
                removeConfirmVmTpl()
                resolve(confirm)
              }
          }
        })
        const confirmVm = new ConfirmComp()
        const confirmVmTpl = confirmVm.$mount().$el
        document.body.appendChild(confirmVmTpl)

        confirmVm.showDialog = true

        function removeConfirmVmTpl() {
          if (document.body.contains(confirmVmTpl)) {
            setTimeout(() => {
              document.body.removeChild(confirmVmTpl);
            }, 300)
          }
        }

        Confirm.installed = true
    })
  }
}

export default Confirm