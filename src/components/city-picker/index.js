import './style.less'

import picker from '../picker'
import popup from '../popup'
import $http from '../../utils/http'

export default {
   components: { picker, popup },
   template: /*html*/`
      <popup :value='show' @on-hide='hide'>
         <div class="picker-title">
            <span class="pt-cancel" @click="hide">取消</span>
            <span class="pt-submit" @click="confirm">确定</span>
         </div>
         <picker :data='cityData' :anchor='anchor' ref='picker' @scrolling='getPickerState' @change='handlePickerChange'></picker>
      </popup>
   `,
   props: {
      show: {
         type: Boolean,
         default: false
      },
      default: {
         type: Object,
         default() {
            return {}
         }
      }
   },
   model: {
      event: 'pickerHide',
      prop: 'show'
   },
   watch: {
      show(val) {
         val && this.$refs['picker'].show()
      }
   },
   data() {
      return {
         cityData: new Array(3).fill([]),
         anchor: [0, 0, 0], // 默认选中
         scrolling: []
      }
   },
   /**
    * step1: 请求 provinces 数据，设置默认选中 privince，获取默认选中的 province 的id
    * step2: 根据 step1 取到的省id, 请求 cities，设置默认city, 获取 city.id
    * step3: 同上
    */
   created() {
      this.getAddress()
         .then(level => {
            this.setAddress(0)
            const provinceId = this.cityData[0][this.anchor[0]].id
            return this.getAddress(provinceId, 1)
         })
         .then(level => {
            this.setAddress(1)
            const cityId = this.cityData[1][this.anchor[1]].id
            return this.getAddress(cityId, 2)
         })
         .then(level => {
            this.setAddress(2)
         })
   },
   methods: {
      /**
       * 地区请求
       * @param {Number|Undefined} id 
       * 不传是 省, 传了是 cities 或 areas
       * @param {Number} level 数据等级, 作为 cityData 和 anchor 下标
       * 0: province
       * 1: city
       * 2: area
       */
      getAddress(id, level = 0) {
         return $http.get('/site/getcity', { id }).then(({ data }) => {
            if (Number(data.code) === 0) {
               this.$set(this.cityData, level, data.data)
               return level + 1
            }
            this.$toast('数据异常')
         }).catch(err => {
            this.$toast('网络异常')
         })
      },
      /**
       * 处理默认选中
       * @param {Number} level 
       */
      setAddress(level = 0) {
         if (this.default.province) {
            const { province, city, area } = this.default
            const addressStr = [ province, city, area ]
            const cityDataItem = this.cityData[level]
            const addressStrItem = addressStr[level]

            for (let p = 0; p < cityDataItem.length; p ++) {
               if (cityDataItem[p].name === addressStrItem) {
                  this.$set(this.anchor, level, p)
                  break;
               }
            }
            
         }
      },
      /**
       * 滚动改变
       */
      handlePickerChange({ level, value }) {
         switch(level) {
            case 0:
               // 改变了 province
               this.anchor = [value.index, 0, 0]
               // 重新请求 city 数据
               this.getAddress(value.data.id, 1)
                  .then(() => {
                     const cityId = this.cityData[1][this.anchor[1]].id
                     // 重新请求 area 数据
                     this.getAddress(cityId, 2)
                  })
               break;
            case 1:
               // 改变了 city
               this.anchor = [this.anchor[0], value.index, 0]
               this.getAddress(value.data.id, 2)
               break;
         }
      },
      /**
       * 记录 picker 滚动状态
       * @param {Object} scrolling 
       */
      getPickerState(scrolling) {
         for (var k in scrolling) {
            this.scrolling[k] = scrolling[k]
         }
      },
      /**
       * 确定执行方法
       * 判断滚动中且有值，才执行 hide
       */
      confirm() {
         const unScrolling = this.scrolling.indexOf(true) === -1
         if (unScrolling && this.$refs['picker'].result()) {
            this.$emit('result', this.$refs['picker'].result())
            this.hide()
         }
      },
      hide() {
         this.$emit('pickerHide', false)
         this.$refs['picker'].hide()
      }
   }
}