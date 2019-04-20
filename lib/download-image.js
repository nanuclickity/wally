const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const axios = require('axios')
const mime = require('mime')
const getDB = require('./db')

function getUUID () {
  return Buffer.from(crypto.randomBytes(8))
    .toString('hex')
    .slice(0, 6)
}

async function getOutputFile (filename, out) {
  const db = await getDB()
  const dir = await db.get('config.dir').value()
  const outDir = (out || dir).replace('~', os.homedir())
  if (!outDir) {
    throw new Error(`No download directory provded`)
  }

  const outFile = path.join(path.normalize(outDir), filename)
  return outFile
}

// Try to get extension from content-type header
// if not present, use extension from url
function getExtension (contentHeader, url) {
  var ext = mime.getExtension(contentHeader)
  if (!ext) {
    let splits = url.split('.')
    ext = splits[splits.length - 1]
  }
  return ext
}

async function fromURL (query, url, out = false) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    const ext = getExtension(response.headers['content-type'], url)
    const filename = query.replace(/\s/g, '-')
    const outFile = await getOutputFile(`${filename}-${getUUID()}.${ext}`, out)
    const outStream = fs.createWriteStream(outFile)

    response.data.pipe(outStream)
    return new Promise((resolve, reject) => {
      outStream.on('finish', () => resolve(outFile))
      outStream.on('error', reject)
    })
  } catch (err) {
    throw err
  }
}

module.exports = {
  fromURL
}
