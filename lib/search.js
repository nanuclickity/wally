const path = require('path')
const sources = require('./sources')
const utils = require('./utils')
const cache = require('../cache.json')
const CACHE_PATH = path.join(__dirname, '../cache.json')

function notInCache (photo) {
  const id = utils.md5(photo.url)
  return !cache.some(cachedId => cachedId === id)
}

function lessThan4k (photo) {
  return photo.height <= 2160 && photo.width >= 1920
}

async function getUncachedImage (images) {
  const uncached = images.filter(lessThan4k).filter(notInCache)
  if (!uncached || !uncached.length) {
    throw new Error(`No photos remaining`)
  }

  const image = uncached.shift()
  cache.push(utils.md5(image.url))
  return utils
    .writeFile(CACHE_PATH, JSON.stringify(cache), 'utf-8')
    .then(() => image.url)
}

async function getImage (options) {
  try {
    const images = await sources.search(options)
    var image = await getUncachedImage(images)
  } catch (err) {
    throw err
  }

  return image
}

module.exports = getImage
