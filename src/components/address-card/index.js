import './style.less'
import $route from '../../mixins/route'

export default {
  template: /*html*/ `
    <section class="panel address">
      <div class="cell cell__access">
        <div class="cell_header">
          <i class="icon icon-location"></i>
        </div>
        <div class="cell_body address-header">
          <span>收货人：{{ address.uname }}</span>
          <span class='link' @click='handleCall'>{{ address.phone }}</span>
        </div>
        <div class="cell_footer" v-if='arrow'></div>
      </div>
      <div class="cell" style="padding-top: 0">
        <div class="cell_header" style="visibility: hidden">
          <i class="icon icon-location"></i>
        </div>
        <template v-if='address'>
          <div class="cell_body" v-if='address.province !== address.city'>
            {{ (address.province || "") + (address.city || "") + (address.area || "") + address.address }}
          </div>
          <div class="cell_body" v-else>
            {{ (address.province || "") + (address.area || "") + address.address }}
          </div>
        </template>
      </div>
    </section>
  `,
  mixins: [$route],
  props: {
    address: Object,
    arrow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCall($event) {
      $event.stopPropagation()
      this.$confirm('<b>拨号</b><br>' + this.address.phone)
        .then(res => {
          res && this.$route.linkTo('call', {
            tel: this.address.phone
          })
        })
    }
  }
}