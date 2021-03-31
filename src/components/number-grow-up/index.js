import TWEEN from '@tweenjs/tween.js';

export default {
  render() {
    return (
      <span>{ this.animatedNumber }</span>
    )
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tweenedNumber: 0
    }
  },
  computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(0);
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted() {
    this.tween(0, this.value)
  },
  methods: {
    tween(startValue, endValue) {
      var vm = this

      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }
      requestAnimationFrame(animate);
      
      new TWEEN.Tween({ number: startValue })
        .to({ number: endValue }, 300)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(({ number }) => {
          vm.tweenedNumber = number
        })
        .start();
    }
  }
}