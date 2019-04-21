const path = require('path')
const os = require('os')
const fs = require('fs')
const crypto = require('crypto')

function relativePath (filePath) {
  return path.normalize(filePath.replace(os.homedir(), '~'))
}

function absolutePath (filePath) {
  return path.normalize(filePath.replace('~', os.homedir()))
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

async function exists (pathLike, statProcess) {
  try {
    await fs.promises.access(pathLike, fs.constants.R_OK)

    if (statProcess && typeof statProcess === 'function') {
      const stat = await fs.promises.stat(pathLike)
      return statProcess(stat)
    }
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}

module.exports = {
  exists,
  relativePath,
  absolutePath,
  md5,
  uniqueId
}
