import './style.less'
export default {
   template: `
      <div>
         <input type="checkbox" class="check">
         <template v-if='checked'>
            <svg class="check-icon checked" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6983"><path d="M512 96C282.2 96 96 282.2 96 512s186.2 416 416 416c229.8 0 416-186.2 416-416S741.8 96 512 96zM447.8 659.4c-4.8 4.8-11.6 8.8-17.6 8.8s-12.8-4.2-17.8-9l-112-112 35.6-35.6 94.4 94.4 249.6-251.4 35 36.2L447.8 659.4z" p-id="6984"></path></svg>
         </template>
         <template v-else>
            <svg class="check-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4576"><path d="M512 143.984c202.912 0 368 165.088 368 368 0 202.912-165.088 368-368 368S144 714.912 144 512C144 309.072 309.072 143.984 512 143.984M512 111.984c-220.912 0-400 179.088-400 400s179.072 400 400 400 400-179.072 400-400S732.912 111.984 512 111.984L512 111.984z" p-id="4577"></path></svg>
         </template>
      </div>
   `,
   props: {
      checked: {
         type: Boolean,
         default: false
      }
   },
   watch: {
      checked(val) {
         this.$emit('change', val)
      }
   }
}