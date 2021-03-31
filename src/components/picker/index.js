import './style.less'

import BScroll from 'better-scroll'

const DATA_NORMAL = 'normal'
const DATA_CASCADE = 'cascade'
const TYPE_NORMAL = 'normal'

export default {
   template: `
      <div class="picker-panel">
         <div class="picker-mask-top"></div>
         <div class="picker-mask-center"></div>
         <div class="picker-wheel-wrapper" ref="wheelWrapper">
            <div class="picker-wheel" v-for="(wheel, index) in pickerData" :key="index">
               <ul class="wheel-scroll">
                  <li class="wheel-item" v-for="(item, index) in wheel" :key="index">
                     {{ item.name }}
                  </li>
               </ul>
            </div>
         </div>
         <div class="picker-mask-bottom"></div>
      </div>
   `,
   props: {
      data: {
         type: Array,
         default () {
            return []
         }
      },
      anchor: {
         type: Array,
         default () {
            return []
         }
      },
      type: {
         type: String,
         default: TYPE_NORMAL
      },
      swipeTime: {
         type: Number,
         default: 1800
      }
   },
   data() {
      return {
         display: false,
         dataChange: false,
         pickerData: this._dataGetter(),
         pickerAnchor: this._anchorGetter(),
         wheels: [],
         current: this._anchorGetter()
      }
   },
   watch: {
      data() {
         this._setPickerData()
      }
   },
   computed: {
      proxyData() {
         return this._dataGetter()
      },
      proxyAnchor() {
         return this._anchorGetter()
      },
      dataType() {
         return !Array.isArray(this.proxyData[0]) ? DATA_CASCADE : DATA_NORMAL
      }
   },
   methods: {
      _dataGetter() {
         let data = null
         switch (this.type) {
            // case TYPE_TIME:
            //    data = timeData;
            //    break
            // case TYPE_DATE:
            //    data = dateData;
            //    break
            case TYPE_NORMAL:
            default:
               data = this.data;
               break
         }
         return [...data]
      },
      _anchorGetter() {
         let anchor = Array.isArray(this.anchor) ? this.anchor : []
         // if (this.anchor.length) {
         //    anchor = this.anchor
         // } else {
         //    switch (this.type) {
         //       // case TYPE_DATE:
         //       //    anchor = dateAnchor;
         //       //    break
         //       case TYPE_NORMAL:
         //       default:
         //          anchor = this.anchor;
         //          break
         //    }
         // }
         anchor = anchor.map((item, i) => {
            let index = 0
            if (item.toString() && typeof item === 'object') {
               if (item.index) {
                  index = item.index
               } else if (item.value) {
                  index = this.pickerData && this.pickerData[i] && this.pickerData[i].indexOf(item.value) > -1 ?
                     this.pickerData[i].indexOf(item.value) : 0
               } else {
                  throw '【picker】anchor illegal'
               }
            } else {
               index = item
            }
            return index
         })
         return [...anchor]
      },
      show() {
         this.display = true
         if (!this.wheels.length || this.dataChange) {
            this.dataType === DATA_CASCADE && this._updatePickerData()
            this.$nextTick(() => {
               const wheelWrapper = this.$refs.wheelWrapper
               this.pickerData.forEach((item, index) => {
                  this._createWheel(wheelWrapper, index).enable()
               })
               this._wheelToAnchor(this.proxyAnchor)
               this.dataChange && this._destroyExtraWheels()
               this.dataChange = false
            })
         } else {
            this.wheels.forEach((wheel) => {
               wheel.enable()
            })
         }
      },
      hide() {
         this.wheels.forEach((wheel) => {
            wheel.disable()
         })
         this.display = false
      },
      _createWheel(wheelWrapper, i) {
         if (!this.wheels[i]) {
            const wheel = this.wheels[i] = new BScroll(wheelWrapper.children[i], {
               wheel: {
                  selectedIndex: 0,
                  rotate: 10
               },
               zoom: true,
               swipeTime: this.swipeTime,
               probeType: 2,
               // zoom: true,
               mouseWheel: true,
               wheelAction: 'zoom'
            })
            wheel.on('scrollStart', () => {
               this.$emit('scrolling', { [i]: true })
            })
            wheel.on('scrollEnd', () => {
               this.$emit('scrolling', { [i]: false })
               this._cascadePickerChange(i)
            })
            wheel.on('scroll', e => {
               // console.log(e)
               const index = wheel.getSelectedIndex()
               console.log(index)
            })
         } else {
            this.wheels[i].refresh()
         }
         return this.wheels[i]
      },
      _cascadePickerChange(i) {
         const currentValue = this._getCurrentValue()[i]
         const newIndex = currentValue.index

         if (newIndex !== this.current[i]) {
            this.$set(this.current, i, newIndex)
            this.$set(this.pickerAnchor, i, newIndex)
            this.$emit('change', {
               level: i,
               value: currentValue
            })
         }

         if (this.dataType !== DATA_CASCADE) return

         if (newIndex !== this.pickerAnchor[i]) {
            this.pickerAnchor.splice(i, 1, newIndex)
            this._updatePickerData(i + 1)
         }
      },
      _wheelToAnchor(data) {
         this.wheels.forEach((wheel, i) => {
            wheel.wheelTo(data[i] || 0)
         })
      },
      _getCurrentValue() {
         const value = []
         this.wheels.forEach((wheel, i) => {
            const j = wheel.getSelectedIndex()
            value.push({
               index: j,
               data: this.pickerData[i][j]
            })
         })
         return value
      },
      _setPickerData() {
         this.pickerData = this._dataGetter()
         // this.pickerAnchor = this._anchorGetter()
         // this.current = this.pickerAnchor
         if (this.display) {
            this.$nextTick(() => {
               const wheelWrapper = this.$refs.wheelWrapper
               this.pickerData.forEach((item, i) => {
                  this._createWheel(wheelWrapper, i)
               })
               this._wheelToAnchor(this.proxyAnchor)
               this._destroyExtraWheels()
            })
         } else {
            this.dataChange = true
         }
      },
      _destroyExtraWheels() {
         const dataLength = this.pickerData.length
         if (dataLength < this.wheels.length) {
            const extraWheels = this.wheels.splice(dataLength)
            extraWheels.forEach((wheel) => {
               wheel.destroy()
            })
         }
      },
      _updatePickerData(wheelIndex = 0) {
         let data = [...this.proxyData]
         let i = 0
         while (data) {
            if (i >= wheelIndex) {
               let wheelData = data.map(item => item.value)
               this.pickerData[i] = wheelData
               this.pickerAnchor[i] = wheelIndex === 0
                  ? (this.pickerAnchor[i] < data.length ? this.pickerAnchor[i] || 0 : 0)
                  : this._reloadWheel(i, wheelData)
            }
            data = data.length ? data[this.pickerAnchor[i]].children : null
            i++
         }
         this.pickerData = this.pickerData.slice(0, i)
      },
      _reloadWheel(index, data) {
         const wheelWrapper = this.$refs.wheelWrapper
         let scroll = wheelWrapper.children[index].querySelector('.wheel-scroll')
         let wheel = this.wheels ? this.wheels[index] : false
         let dist = 0
         if (scroll && wheel) {
            this.$set(this.pickerData, index, data)
            this.pickerAnchor[index] = dist
            this.$nextTick(() => {
               wheel = this._createWheel(wheelWrapper, index)
               wheel.wheelTo(dist)
            })
         }
         return dist
      },
      confirm() {
         const isInTransition = this.wheels.some((wheel) => {
            return wheel.isInTransition
         })
         if (isInTransition) {
            return
         }
         const selectedValues = this._getCurrentValue()
         // this.$emit(EVENT_CONFIRM, selectedValues)
         this.hide()
         return selectedValues
      },
      cancel() {
         // this.$emit(EVENT_CANCEL)
         // this.hide()
      },
      result() {
         return this.confirm()
      }
   }
}