/**
 * 单个路由参数获取
 * @param {String} name 
 */
const getQuery = name => {
   if (!name || typeof name !== 'string') {
      throw '【routeQuery】arguments[0] must be a string'
   }
   var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");  
   if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " ")); 
   return "";
}

/**
 * 多/单个路由参数获取
 * @param {String|Array} options 
 * @return {String}
 */
export default options => Array.isArray(options) 
   ? options.map(name => getQuery(name))
   : getQuery(options)