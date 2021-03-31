/*
 * @Author: Tukun33 
 * @Date: 2018-07-24 11:22:45 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-07-24 11:23:53
 * @class Oss: 私有资源 url 签名
 */

import Crypto from './Crypto'
// const qs = require('qs')

class Oss {
   /**
    * @param {Object} options
    * {
    *    AccessKey,
    *    AccessSecret,
    *    endpoint,
    *    expires
    * }
    */
   constructor(options) {
      options['method'] = 'GET'
      options['expires'] = options.expires || (parseInt(Date.now() / 1000) + 2 * 60 * 60)
      this.options = options
   }

   buildCanocalString(name) {
      const CanonicalizedResource = this.buildCanonicalizedResource(name)
      let signContent = [
         this.options.method, // Verb
         "", // content-md5
         "", // content-type
         this.options.expires.toString(), // Date
         CanonicalizedResource
      ]
      return signContent.join('\n')
   }

   buildCanonicalizedResource(name) {
      const bucket = this.options.endpoint.split('//')[1].split('.')[0]
      return `/${ bucket }/${ name }`
   }

   signature(name) {
      const canonicalString = this.buildCanocalString(name)
      const { AccessSecret } = this.options
      const hash = Crypto.HmacSHA1(canonicalString, AccessSecret)
      const sign = hash.toString(Crypto.enc.Base64)
      return encodeURIComponent(sign)
   }

   signUrl(name = "") {
      const { endpoint, AccessKey, expires } = this.options
      const self = this
      
      // encodeURIComponent 与 qs.stringify 有冲突 ！！！
      // console.log(qs.stringify({
      //    OSSAccessKeyId: AccessKey,
      //    Expires: expires,
      //    Signature: encodeURIComponent(self.signature(name))
      // }))
      if (name.indexOf('http') === 0) {
        return name;
      }
      return `${ endpoint }/${ name }?OSSAccessKeyId=${ AccessKey }&Expires=${ expires }&Signature=${ self.signature(name) }`
   }
}

export default Oss