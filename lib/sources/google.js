const match = str => ['google', 'g', '*'].includes(str)

const search = query => {
  const q = query // + ' wallpaper'
  const url = [
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}`,
    `cx=${process.env.GOOGLE_CSE_ID}`,
    `key=${process.env.GOOGLE_CSE_API_KEY}`,
    `searchType=image`,
    `siteSearch=unsplash.com`,
    `siteSearchFilter=e`,
    `imgSize=huge`
  ]

  return url.join('&')
}

const parse = response =>
  (response.items || []).map(item => {
    return {
      url: item.link,
      width: item.image.width,
      height: item.image.height
    }
  })

module.exports = {
  name: 'google',
  match,
  search,
  parse
}
