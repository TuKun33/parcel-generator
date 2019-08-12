module.exports = {
  isDev() {
  	return process.env.NODE_ENV === 'development'
  },
  set(dev) {
    process.env.NODE_ENV = dev ? 'development' : 'production'
  }
}