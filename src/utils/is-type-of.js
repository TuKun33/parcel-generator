export default {
   string(arg) {
      return typeof arg === 'string'
   },
   array(arg) {
      return Array.isArray(arg)
   },
   number(arg) {
      return arg && typeof arg === 'number'
   },
   object(arg) {
      return arg && typeof arg === 'object'
   },
   boolean(arg) {
      return typeof arg === 'boolean'
   },
   null(arg) {
      return typeof arg === 'object' && JSON.stringify(arg) === 'null'
   },
   undefined(arg) {
      return typeof arg === 'undefined'
   },
   function(arg) {
      return typeof arg === 'function'
   },
   symbol(arg) {
      return typeof arg === 'symbol'
   },
   promise(arg) {
      return this.object(arg) && typeof arg.then === 'function' && typeof arg.catch === 'function'
   },
   class(arg) {
      var fn = arg
      var toString = Function.prototype.toString
      var fnBody = fn => toString.call(fn).replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'')

      return (
         typeof fn === 'function' &&
         (
            /^class(\s|\{\}$)/.test(toString.call(fn)) || 
            (/^.*classCallCheck\(/.test(fnBody(fn)))
         )
      )
   }
}