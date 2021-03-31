import './style.less'

import popup from '../popup'
import TransferDom from '../../directives/transfer-dom'
import $http from '../../utils/http'

export default {
   template: /*html*/`
   <div class='cancel-box'>
      <button class="btn disabled" @click='popupShow = true'>取消订单</button>
      <div v-transfer-dom class='cancel-box'>
         <popup v-model='popupShow'>
            <div class="popup-header">
               <span @click='popupShow = false;active = -1'>取消</span>
               <span @click='handleCancel' :class='{ "active": active !== -1 }'>确定</span>
            </div>
            <div class="popup-body">
               <a v-for='(item, i) in cancelReason' :key='i'
                  @click='active = i'
                  :class='{ active: active === i }'
                  >
                  {{ item.name }}
               </a>
            </div>
         </popup>
      </div>
   </div>
   `,
   components: { popup },
   directives: { TransferDom },
   props: ['orderId'],
   data() {
      return {
         popupShow: false,
         cancelReason: [
            { name: '我不想买了' },
            { name: '信息填写有误重新购买' },
            { name: '卖家缺货' },
            { name: '其他原因' }
         ],
         active: 0
      }
   },
   created() {
      this.getReason()
   },
   methods: {
      getReason() {
         $http.get('/order/getreason').then(({ data }) => {
            if (+data.code === 0) {
               this.cancelReason = data.data
            }
         })
      },
      handleCancel() {
         if (this.active !== -1) {
            this.popupShow = false
            this.$emit('confirm', {
               ...this.cancelReason[this.active],
               orderId: this.orderId
            })
            this.active = -1
         }
      }
   }
}