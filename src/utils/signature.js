import crypto from './Crypto'
import base64 from './Base64'
import is from './is-type-of'

export default {
   /**
    *
    * @param {String} resourcePath
    * @param {Object} parameters
    * @return
    */
   buildCanonicalizedResource(resourcePath, parameters) {
      let canonicalizedResource = `${resourcePath}`;
      let separatorString = '?';

      if (is.string(parameters) && parameters.trim() !== '') {
         canonicalizedResource += separatorString + parameters;
      } else if (is.array(parameters)) {
         parameters.sort();
         canonicalizedResource += separatorString + parameters.join('&');
      } else if (parameters) {
         const compareFunc = (entry1, entry2) => {
            if (entry1[0] > entry2[0]) {
               return 1;
            } else if (entry1[0] < entry2[0]) {
               return -1;
            }
            return 0;
         };
         const processFunc = (key) => {
            canonicalizedResource += separatorString + key;
            if (parameters[key]) {
               canonicalizedResource += `=${parameters[key]}`;
            }
            separatorString = '&';
         };
         Object.keys(parameters).sort(compareFunc).forEach(processFunc);
      }

      return canonicalizedResource;
   },

   /**
    * @param {String} method
    * @param {String} resourcePath
    * @param {Object} request
    * @param {String} expires
    * @return {String} canonicalString
    */
   buildCanonicalString(method, resourcePath, request, expires) {
      request = request || {};
      const headers = request.headers || {};
      const OSS_PREFIX = 'x-oss-';
      const ossHeaders = [];
      const headersToSign = {};

      let signContent = [
         method.toUpperCase(),
         headers['Content-Md5'] || '',
         headers['Content-Type'] || headers['Content-Type'.toLowerCase()],
         expires || headers['x-oss-date'],
      ];

      Object.keys(headers).forEach((key) => {
         const lowerKey = key.toLowerCase();
         if (lowerKey.indexOf(OSS_PREFIX) === 0) {
            headersToSign[lowerKey] = String(headers[key]).trim();
         }
      });

      Object.keys(headersToSign).sort().forEach((key) => {
         ossHeaders.push(`${key}:${headersToSign[key]}`);
      });

      signContent = signContent.concat(ossHeaders);

      signContent.push(this.buildCanonicalizedResource(resourcePath, request.parameters));

      return signContent.join('\n');
   },

   /**
    * @param {String} accessKeySecret
    * @param {String} canonicalString
    */
   computeSignature(accessKeySecret, canonicalString) {
      const signature = crypto.HMAC(Crypto.SHA1, accessKeySecret, canonicalString);
      //   return signature.update(new Buffer(canonicalString, 'utf8')).digest('base64');
      return base64.encode(signature)
   },

   /**
    * @param {String} accessKeyId
    * @param {String} accessKeySecret
    * @param {String} canonicalString
    */
   authorization(accessKeyId, accessKeySecret, canonicalString) {
      return `OSS ${accessKeyId}:${this.computeSignature(accessKeySecret, canonicalString)}`;
   },

   /**
    *
    * @param {String} accessKeySecret
    * @param {Object} options
    * @param {String} resource
    * @param {Number} expires
    */
   getSignature(accessKeySecret, options, resource, expires) {
      const headers = {};
      const subResource = {};

      if (options.process) {
         const processKeyword = 'x-oss-process';
         subResource[processKeyword] = options.process;
      }

      if (options.response) {
         Object.keys(options.response).forEach((k) => {
            const key = `response-${k.toLowerCase()}`;
            subResource[key] = options.response[k];
         });
      }

      Object.keys(options).forEach((key) => {
         const lowerKey = key.toLowerCase();
         const value = options[key];
         if (lowerKey.indexOf('x-oss-') === 0) {
            headers[lowerKey] = value;
         } else if (lowerKey.indexOf('content-md5') === 0) {
            headers[key] = value;
         } else if (lowerKey.indexOf('content-type') === 0) {
            headers[key] = value;
         } else if (lowerKey !== 'expires' && lowerKey !== 'response' && lowerKey !== 'process' && lowerKey !== 'method') {
            subResource[lowerKey] = value;
         }
      });

      if (Object.prototype.hasOwnProperty.call(options, 'security-token')) {
         subResource['security-token'] = options['security-token'];
      }

      if (Object.prototype.hasOwnProperty.call(options, 'callback')) {
         const json = {
            callbackUrl: encodeURI(options.callback.url),
            callbackBody: options.callback.body,
         };
         if (options.callback.host) {
            json.callbackHost = options.callback.host;
         }
         if (options.callback.contentType) {
            json.callbackBodyType = options.callback.contentType;
         }
         subResource.callback = base64.encode(JSON.stringify(json))

         if (options.callback.customValue) {
            const callbackVar = {};
            Object.keys(options.callback.customValue).forEach((key) => {
               callbackVar[`x:${key}`] = options.callback.customValue[key];
            });
            subResource['callback-var'] = base64.encode(JSON.stringify(callbackVar))
         }
      }

      const canonicalString = this.buildCanonicalString(options.method, resource, {
         headers,
         parameters: subResource,
      }, expires.toString());

      return {
         Signature: this.computeSignature(accessKeySecret, canonicalString),
         subResource,
      };
   }
}