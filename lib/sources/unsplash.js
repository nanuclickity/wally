const getDB = require('../db')

const match = str => ['unsplash', 'u', '*'].includes(str)

// Get search url
const search = async query => {
  const db = await getDB()
  const key = await db.get('config.unsplash_access_key').value()
  const url = [
    'https://api.unsplash.com/search/photos?page=1&per_page=50',
    `orientation=landscape`,
    `query=${encodeURIComponent(query)}`,
    `client_id=${key}`
  ].join('&')

  return url
}

// PostProcess the results after api call
const parse = response =>
  (response.results || []).map(item => {
    return {
      url: item.urls.full,
      width: item.width,
      height: item.height
    }
  })

module.exports = {
  name: 'unsplash',
  match,
  search,
  parse
}
