const { dirname, join }= require('path')

const filename = __filename
const dirnameValue = dirname(filename)


module.exports= {dirnameValue}