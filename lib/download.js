const fs = require('fs')
const path = require('path')
const axios = require('axios')
const mime = require('mime')
const getDB = require('./db')
const Utils = require('./utils')

// Try to get extension from content-type header
// if not present, use extension from url
function getExtension (contentHeader, url) {
  let ext = mime.getExtension(contentHeader)
  if (!ext) {
    const splits = url.split('.')
    ext = splits[splits.length - 1]
  }
  return ext
}

async function getOutputFilePath (filename, programDir) {
  const configDir = await getDB().then(db => db.get('config.dir').value())
  const outDir = Utils.absolutePath(programDir || configDir)
  if (!outDir) {
    throw new Error(`Invalid download directory: ${outDir}`)
  }
  const filePath = path.join(outDir, filename)
  return filePath
}

module.exports = async function download (url, program) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  const ext = getExtension(response.headers['content-type'], url)
  const filename = [
    program.query.replace(/\s/g, '-'),
    Utils.uniqueId() + '.' + ext
  ].join('-')

  const outFile = await getOutputFilePath(filename, program.dir)
  const outStream = fs.createWriteStream(outFile)

  response.data.pipe(outStream)
  return new Promise((resolve, reject) => {
    outStream.on('finish', () => resolve(outFile))
    outStream.on('error', reject)
  })
}
