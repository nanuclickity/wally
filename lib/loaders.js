const _ = require('lodash')
const ora = require('ora')

const loaders = {
  finding: ora(' Finding wallpapers...'),
  downloading: ora(' Downloading...'),
  setting: ora(' Setting wallpaper...')
}

const stopAllLoaders = message => {
  _.values(loaders)
    .filter(x => x.isSpinning)
    .forEach(loader => {
      message ? loader.fail(' ' + message) : loader.stop()
    })
}

const start = name => {
  const loader = loaders[name]
  loader.start()
}

const finish = (name, options) => {
  const loader = loaders[name]
  if (options && typeof options === 'object') {
    loader.stopAndPersist(options)
  } else {
    loader.stop()
  }
}

module.exports = {
  start,
  finish,
  stopAllLoaders
}
