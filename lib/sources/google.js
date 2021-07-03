const getDB = require('../db')
const match = str => ['google', 'g', '*'].includes(str)

const search = async query => {
  const db = await getDB()
  const cseId = await db.get('config.google_cse_id').value()
  const cseKey = await db.get('config.google_cse_api_key').value()
  const q = query // + ' wallpaper'
  const url = [
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}`,
    `cx=${cseId}`,
    `key=${cseKey}`,
    'searchType=image',
    'siteSearch=unsplash.com',
    'siteSearchFilter=e',
    'imgSize=huge'
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
