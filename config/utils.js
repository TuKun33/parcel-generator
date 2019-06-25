const fs = require('fs')

module.exports = {
  /**
   * 删除路径下的所有文件
   * @param {string} path 目标路径
   */
  deleleDirAll(path) {
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
              deleleDirAll(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        // fs.rmdirSync(path);
    }
  },

  // 获取命令行参数
  getProcessArgs() {
    const args = process.argv.slice(2)
    const querys = {}
    args.forEach(arg => {
      if (arg.includes('=')) {
        const [k, v] = arg.split('=')
        querys[k] = v
      } else {
        querys[arg] = ""
      }
    })
    return querys
  }
}