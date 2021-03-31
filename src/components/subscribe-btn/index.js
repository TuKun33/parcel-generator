import './style.less'
import $http from '../../utils/http'
import $route from '../../mixins/route'
import popup from '../popup'

export default {
  name: 'subscribe-btn',
  template: //template
    `<div>
      <template v-if='lessonType === 1 && !content.is_buy'>
        <footer class="footer">   
          <div class="action-left" @click='$route.linkTo("customer", { id: content.id, type: content.type })'>
            <i class="icon icon-customer"></i>
            <span>联系客服</span>
          </div>
          <div class="action-right" @click='popupShow = true'>立即订阅</div>
        </footer>

        <popup v-model='popupShow'>
          <header class="popup-header">
            订阅 <i class="icon icon-close" @click='popupShow = false'></i>
          </header>
          <main class="popup-body">
            <div v-for='(item, i) in product' :key="i"
              class="item" :class='{ "active": active === i, "disabled": !Boolean(item.valid) }'
              @click='handleProductCheck(i)'>
              <div class="duration">{{ item.duration }}个月</div>
              <div class="price"><i>￥</i>{{ item.price }}</div>
              <div class="old-price">￥{{ item.oldPrice }}</div>
            </div>
          </main>
          <footer class="popup-footer" @click='makeOrder'>立即订阅</footer>
        </popup>
      </template>
      <template v-else-if='lessonType === 2'>
        <footer class="footer">     
          <div class="action-left" v-if='lessonType === 1' @click='$route.linkTo("customer", { id: content.id, type: content.type })'>
            <i class="icon icon-customer"></i>
            <span>联系客服</span>
          </div>
          <div class="action-right" @click='makeOrder'>（￥{{ content.price }}）立即购买</div>
        </footer>
      </template>
    </div>
  `,
  components: {
    popup
  },
  mixins: [$route],
  props: {
    content: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      popupShow: false,
      product: [1, 2, 3].map(id => ({
        id,
        duration: '-',
        price: '-',
        oldPrice: '-'
      })),
      active: -1,
      lessonType: 1
    }
  },
  watch: {
    active(i) {
      this.$emit('checked', this.product[i])
    }
  },
  created() {
    // 1.正式课 2.体验课
    this.lessonType = +this.content.theme_type // === 10 ? 2 : 1
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      $http.get('/order/selltype')
        .then(({
          data
        }) => {
          if (+data.code === 0) {
            this.product = data.data
            const tempData = this.product.sort(
              (current, next) => current.duration - next.duration
            )
            for (let i = 0; i < tempData.length; i++) {
              if (tempData[i].valid) {
                this.active = i
                break;
              }
            }
          }
        })
        .catch(err => {
          this.$toast('网络错误')
        })
    },
    handleProductCheck(i) {
      if (!this.product[i].valid) {
        // this.$toast('该选项不可用')
        this.canotOrderConfirm(2)
        return
      }
      this.active = i
    },
    
    /**
     * 拦截
     * @param {Number} status 1未支付 2已支付未发货 3已发货 4已取消 5已完成
     */
    canotOrderConfirm(status = 4) {
      if (status && status < 4) {
        const alertText = status === 1 ? '您有未完成的订单' : '您已经购买过相关课程'
        const confirmText = status === 1 ? '去支付' : '查看订单'
        const { userid, token } = this.$route.query
        this.$confirm(alertText, { confirmText })
          .then(res => {
            res && this.$route.routeTo('/order/list', {
              nav: status !== 1 ? 0 : 1,
              userid,
              token
            })
          })
        return true
      }
    },

    /**
     * 检查当前购买状态
     * @return {Promise} 是否购买
     */
    checkOrder(contentid = 10) {
      return $http.get('/user/checkorder', {
        contentid
      }).then(({ data }) => {
        return +data.code === 0 ? data.data.status : 4
      }).catch(err => {
        return Promise.resolve(4)
      })
    },

    makeOrder() {
      if (this.lessonType === 2) {
        this.checkOrder(this.content.id)
          .then(status => {
            if (!this.canotOrderConfirm(status)) {
              // this.$emit('make-order')
              this.makeOrderSubmit()
            }
          })
      } else if (!this.product[this.active].valid) {
        this.canotOrderConfirm(2)
      } else {
        // this.$emit('make-order')
        this.makeOrderSubmit()
      }
    },

    makeOrderSubmit() {
      // (async () => {
      //   const res = await $http.get('/user/addresslist')
      //   if (Number(res.data.code) === 0) {
      //     const addresses = res.data.data
      //     // 路由跳转参数
      //     const querys = {
      //       from: 'subscribe',
      //       contentId: this.content.id,
      //       productId: this.product[this.active].id /////// 体验课没有product
      //     }
      //     if (addresses.length) {
      //       // 取出默认地址
      //       const defaultAddress = addresses.filter(item => Number(item.is_default) === 1)[0]
      //       // 带上地址id
      //       querys.addressId = defaultAddress ? defaultAddress.id : addresses[0].id
      //       this.$route.routeTo('/order/do', querys)
      //     } else {
      //       // 新增地址
      //       this.$route.routeTo('/address', querys)
      //     }
      //   } else {
      //     this.$toast(res.data.message)
      //   }
      // })()

      $http.get('/user/addresslist')
        .then(res => 
          +res.data.code === 0 
            ? res.data.data 
            : Promise.reject(res.data.message)
        )
        .then(addresses => {
          const querys = {
            from: 'subscribe',
            contentId: this.content.id,
          }
          if (this.lessonType === 1) {
            querys.productId = this.product[this.active].id /////// 体验课没有product
          }
          if (addresses.length) {
            // 取出默认地址
            const defaultAddress = addresses.filter(item => Number(item.is_default) === 1)[0]
            // 带上地址id
            querys.addressId = defaultAddress ? defaultAddress.id : addresses[0].id
            this.$route.routeTo('/order/do', querys)
          } else {
            // 新增地址
            this.$route.routeTo('/address', querys)
          }
        })
        .catch(err => {
          this.$toast(err)
        })
    },
  }
}