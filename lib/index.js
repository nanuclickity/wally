const pkg = require('../package.json')
const path = require('path')
const program = require('commander')
const ora = require('ora')
const wallpaper = require('wallpaper')

const download = require('./download-image')
const utils = require('./utils')
const search = require('./search')

function collectQuery (val, memo) {
  memo.push(val)
  return val
}

program
  .version(pkg.version)
  .option('-q, --query [value]', 'Get wallpaper from a query', collectQuery, [])
  .option('-d, --dir [path]', 'Directory to save wallpapers in', path.resolve)
  .option('-s, --set [bool]', 'Set as desktop wallpaper', Boolean)
  .option('-g, --google', 'Use google search')
  .option('-u, --unsplash', 'Use unsplash search')
  .parse(process.argv)

if (typeof program.query === 'undefined' || !program.query.length) {
  console.error('-q, --query is required')
  process.exit(1)
}

const query = program.query.split(',').join(' ')

const loaders = {
  finding: ora(` Finding wallpapers matching: ${query}`),
  downloading: ora(` Downloading`),
  setting: ora(` Setting wallpaper`)
}

function stopLoaders (errorMessage) {
  Object.keys(loaders)
    .map(x => loaders[x])
    .filter(x => x.isSpinning)
    .forEach(loader => {
      if (errorMessage) {
        loader.fail(' ' + errorMessage)
      } else {
        loader.stop()
      }
    })
}

async function main () {
  loaders.finding.start()
  try {
    var imageUrl = await search(program)
    loaders.finding.stopAndPersist({
      symbol: `📸`,
      text: 'Found image'
    })

    loaders.downloading.start()
    var outFile = await download.fromURL(query, imageUrl, program.dir || false)
    loaders.downloading.stopAndPersist({
      symbol: `⬇️ `,
      text: `Saved to ${utils.relativePath(outFile)}`
    })

    if (program.set) {
      loaders.setting.start()
      await wallpaper.set(outFile)
      loaders.setting.stopAndPersist({
        symbol: `👌`,
        text: 'Wallpaper set successfully'
      })
    }

    console.log('Done')
  } catch (err) {
    stopLoaders(err.message)
    // console.log(`\n${err.message}`)
    // console.error(err)
    if (err.config && err.config.url) {
      console.log(`URL: ${err.config.url}`)
    }
    process.exit(1)
  }
}

main()
