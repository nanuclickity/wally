const sources = require('./sources')
const utils = require('./utils')
const getDB = require('./db')

async function notInCache (photo) {
  const db = await getDB()
  const id = utils.md5(photo.url)

  const exists = await db.get('cache').find(id)
  return !exists
}

function lessThan4k (photo) {
  return photo.height <= 2160 && photo.width >= 1920
}

async function getUncachedImage (images, db) {
  const uncached = images.filter(lessThan4k).filter(notInCache)
  if (!uncached || !uncached.length) {
    throw new Error(`No photos remaining`)
  }

  const image = uncached.shift()
  await db
    .get('cache')
    .push(utils.md5(image.url))
    .write()
  return image.url
}

async function getImage (options) {
  const db = await getDB()
  try {
    const images = await sources.search(options)
    var image = await getUncachedImage(images, db)
  } catch (err) {
    throw err
  }

  return image
}

module.exports = getImage
