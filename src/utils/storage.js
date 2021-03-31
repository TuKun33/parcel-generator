class Storage {
   constructor (type = 'localStorage') {
      this.storage = window[type]
   }
   set(key, value) {
      this.storage.setItem(key, JSON.stringify({ [key]: value }))
      return value
   }

   get(key) {
      const tempData = JSON.parse(this.storage.getItem(key))
      return tempData && typeof tempData === 'object' ? tempData[key] : null
   }

   remove(key) {
      const data = this.get(key)
      this.storage.removeItem(key)
      return data
   }

   clear() {
      this.storage.clear()
   }
}

export default new Storage()