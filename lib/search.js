const sources = require('./sources')
const utils = require('./utils')
const getDB = require('./db')

const notInCache = cache => photo => {
  const id = utils.md5(photo.url)

  const matches = cache.filter(c => c.id === id)
  return !matches.length
}

const lessThan4k = photo => {
  return photo.height <= 2160 && photo.width >= 1920
}

async function getUncachedImage (images, source, db) {
  const cache = await getDB().then(db => db.get('cache').value())
  const uncached = images.filter(lessThan4k).filter(notInCache(cache))
  if (!uncached || !uncached.length) {
    throw new Error('No photos remaining')
  }

  const image = uncached.shift()
  await db
    .get('cache')
    .push({ id: utils.md5(image.url), source })
    .write()
  return image.url
}

async function getImage (program) {
  const db = await getDB()
  const { images, source } = await sources.search(program)
  const image = await getUncachedImage(images, source, db)
  return image
}

module.exports = getImage
