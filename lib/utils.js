const path = require('path')
const os = require('os')
const fs = require('fs')
const crypto = require('crypto')

function relativePath (filePath) {
  return path.normalize(filePath.replace(os.homedir(), '~'))
}

function writeFile (filePath, data, options) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, options, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function md5 (str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex')
}

function uniqueId (prefix = '', len = 6) {
  const str = Buffer.from(crypto.randomBytes(8))
    .toString('hex')
    .slice(0, len)
  return prefix + str
}

module.exports = {
  relativePath,
  writeFile,
  md5,
  uniqueId
}
