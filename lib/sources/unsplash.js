const match = str => ['unsplash', 'u', '*'].includes(str)

// Get search url
const search = query => {
  const url = [
    'https://api.unsplash.com/search/photos?page=1&per_page=50',
    `orientation=landscape`,
    `query=${encodeURIComponent(query)}`,
    `client_id=${process.env.UNSPLASH_ACCESS_KEY}`
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
