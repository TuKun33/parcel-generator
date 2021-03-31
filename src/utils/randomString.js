/**
 * 获取随机字符串
 * @param {Number} len 字符串长度
 */
const randomString = (len = 16) => {
   var STR = 'qwertyuiopasdfghjklzxcvbnm1234567890'
   if (len > STR.length) {
      var i = 0
      while(i < (len / STR.length + 1)) {
         i++
         STR += STR
      }
   }
   return STR
      .split('')
      .map(item => STR[Math.ceil(Math.random() * (STR.length - 1))])
      .join('')
      .slice(0, len)
}

export default randomString