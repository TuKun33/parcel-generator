import axios from 'axios'
// import ENV from '../ENV'
import storage from './storage';
const { stringify } = require('qs')

// const { BASE_URL, appid, appKey, appSign } = ENV
axios.defaults.baseURL = "/ball"
axios.defaults.withCredentials = true
// 获取 { id, token }
const USER = () => storage.get('user') || {}

axios.interceptors.request.use(config => {
   const defaultParams = {
      token: 'ai34f56ytghb6yuhg21vbnsa6uou0ih7jabbsva0'
   }
   if (config.method.toLowerCase() === 'get') {
      config.params = {
         ...defaultParams, ...config.params
      }
   } else {
      config.data = stringify({ 
         ...defaultParams, ...config.data
      })
      config.headers = { 'Content-type': 'application/x-www-form-urlencoded' }
   }
   return config
})

axios.interceptors.response.use(
  res => Promise.resolve(res),
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default {
   get(url, params = {}, configs = {}) {
      return axios.get(url, Object.assign({ params }, configs))
   },
   post: axios.post,
}