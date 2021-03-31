const LOAD_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/wAALCABNAEwBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/ALoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/9k='

import Oss from '../../utils/Oss'
import { production } from '../../ENV'

export const oss = new Oss(production().OSS_CONFIG)

export default {
   props: {
    src: String,
    sign: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: 'native'
      // native: 不做改变，用img去加载
      // cover: 用bg加载，填充容器
    }
   },
   data() {
      return {
         LOAD_IMAGE,
         finalySrc: '',
         loading: true
      }
   },
   computed: {
    finalySrcer() {
      return this.signSrc(this.finalySrc)
    }
   },
   template: /* html */`
      <div v-if='mode === "cover"' :style='{
        backgroundImage: "url(" + finalySrcer + ")",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }'>
        <img style='display:none' :src="finalySrcer" @load='handleLoad' @error='handleError'/>
      </div>
      <img v-else :src="finalySrcer" @load='handleLoad' @error='handleError'/>
   `,
   created() {
      if (this.src && !this.finalySrc) {
         this.finalySrc = this.src
      }
   },
   mounted() {
    if (this.src && !this.finalySrc) {
      this.finalySrc = this.src
    }
   },
   watch: {
      src(val) {
         if (!this.finalySrc) {
            this.finalySrc = val
         }
      }
   },
   methods: {
      handleLoad(e) {
         this.loading = false
      },
      handleError(err) {
         console.error(err)
         this.loading = true
         this.finalySrc = ''
      },
      signSrc(name) {
        if (!this.sign || name.indexOf('http') === 0) {
          return name
        }
        if (!this.loading && this.finalySrc) {
          return oss.signUrl(name)
        }
        return LOAD_IMAGE
      }
   }
}