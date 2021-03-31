export default {
   template: `
      <div class="swiper-item">
         <slot></slot>
      </div>
   `,
   mounted() {
      this.$parent && this.$parent.swiperItemCreated(this);
   },
   destroyed() {
      this.$parent && this.$parent.swiperItemDestroyed(this);
   }
}