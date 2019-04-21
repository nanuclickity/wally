const axios = require('axios')
const unsplash = require('./unsplash')
const google = require('./google')

const sources = [unsplash, google]

function getSource (options, sourceIndex) {
  if (options.google) {
    return sources[1]
  }
  if (options.unsplash) {
    return sources[0]
  }
  return sources[sourceIndex]
}

async function search (options, sourceIndex = 0) {
  if (sourceIndex > sources.length - 1) {
    throw new Error(`Unknown source: ${sources[sourceIndex]}`)
  }

  const sourceSpecified = options.google || options.unsplash

  try {
    var source = getSource(options, sourceIndex)
    console.log(`\n   Searching: ${source.name} -> ${options.query}`)
    const url = await source.search(options.query)
    const response = await axios.get(url)
    var images = source.parse(response.data)

    if (!images.length && !sourceSpecified) {
      images = search(options, sourceIndex + 1)
    }
  } catch (err) {
    throw err
  }

  return { images, source: source.name }
}

module.exports = {
  search,
  sources
}
