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
    throw new Error(`Not found in sources`)
  }

  const sourceSpecified = options.google || options.unsplash

  try {
    const source = getSource(options, sourceIndex)
    console.log(`\n   Searching: ${source.name} -> ${options.query}`)
    const url = source.search(options.query)
    const response = await axios.get(url)
    var results = source.parse(response.data)

    if (!results.length && !sourceSpecified) {
      results = search(options, sourceIndex + 1)
    }
  } catch (err) {
    throw err
  }

  return results
}

module.exports = {
  search,
  sources
}
