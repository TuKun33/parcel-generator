import './index.less'
import imager from '../imager'
export default {
   props: [ 'info' ],
   components: { imager },
   template: `
      <div @click='$emit("click")'>
         <div class='card-cover'>
            <imager :src='info.imgurl'/>
            <span class='cover-bradge'>{{ info.txt }}</span>
         </div>
         <h3 class='card-title'>{{ info.title }}</h3>
         <p class='card-desc'>{{ info.desc }}</p>
         <div class='card-footer link'>￥{{ info.price }}/年</div>
      </div>
   `
}