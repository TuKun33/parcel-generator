import './style.less';

export default {
   template: `
      <div class='form-item'>
         <label>{{ label }}</label>

         <template>
            <textarea 
               v-if='type === "textarea"' 
               v-model='_value' 
               :name='name'
               :placeholder='placeholder'
               :disabled='disabled'
               @keyup.enter="handleEnter"
               @keyup="handleKeyup"
               @keypress="handleKeypress"
               @keydown="handleKeydown"
               @focus="handleFocus"
               @blur="handleBlur"
               @input="handleInput"
            ></textarea>
            <input 
               v-else 
               :type='type' 
               v-model='_value'
               :name='name'
               :placeholder='placeholder'
               :disabled='disabled'
               @keyup.enter="handleEnter"
               @keyup="handleKeyup"
               @keypress="handleKeypress"
               @keydown="handleKeydown"
               @focus="handleFocus"
               @blur="handleBlur"
               @input="handleInput"
               @change="handleChange"
            />
         </template>

         <span class='form-item__action' v-if='clearable' @click='handleClear'>
            <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1392"><path d="M504.0128 467.8144l253.44-253.44a38.4 38.4 0 1 1 54.272 54.3232l-253.4144 253.44 253.44 253.4144a38.4 38.4 0 1 1-54.2976 54.2976l-253.44-253.44-253.44 253.44a38.4 38.4 0 0 1-54.272-54.2976l253.4144-253.44-253.44-253.44a38.4 38.4 0 0 1 54.3232-54.272l253.44 253.4144z" fill="#333333" p-id="1393"></path></svg>
         </span>
      </div>
   `,
   props: {
      label: {
         type: String,
         default: ''
      },
      type: {
         validator(val) {
            return ['text', 'textarea', 'number', 'password', 'url', 'email', 'date'].indexOf(val) >= 0
         },
         default: 'text'
      },
      clearable: {
         type: Boolean,
         default: true
      },
      value: {
         type: [String, Number],
         default: ''
      },
      placeholder: {
         type: String,
         default: ''
      },
      disabled: {
         type: Boolean,
         default: false
      },
      name: {
         type: String,
         default: ''
      }
   },
   model: {
      prop: 'value',
      event: 'input'
   },
   data() {
      return {
         _value: this.value
      }
   },
   watch: {
      value(val) {
         this._value = val
      }
   },
   methods: {
      handleClear() {
         const e = { target: { value: '' } };
         this._value = ''
         this.$emit('input', '');
         this.$emit('on-change', e);
      },
      handleEnter(event) {
         this.$emit('on-enter', event);
      },
      handleKeydown(event) {
         this.$emit('on-keydown', event);
      },
      handleKeypress(event) {
         this.$emit('on-keypress', event);
      },
      handleKeyup(event) {
         this.$emit('on-keyup', event);
      },
      handleIconClick(event) {
         this.$emit('on-click', event);
      },
      handleFocus(event) {
         this.$emit('on-focus', event);
      },
      handleBlur(event) {
         this.$emit('on-blur', event);
      },
      handleInput(event) {
         let value = event.target.value;
         this.$emit('input', value);
         this.$emit('on-change', event);
      },
      handleChange(event) {
         this.$emit('on-input-change', event);
      },
   }
}