const wallpaper = require('wallpaper')

const Loaders = require('../loaders')
const Utils = require('../utils')

// Modules
const config = require('./config')
const common = require('./common')
const cache = require('./cache')

// Runners
const search = require('../search')
const download = require('../download')

async function searchImage (program) {
  Loaders.start('finding', { query: program.query })
  const imageUrl = await search(program)
  Loaders.finish('finding', {
    symbol: '📸',
    text: 'Found image'
  })

  return imageUrl
}

async function downloadImage (url, program) {
  Loaders.start('downloading')
  const outFile = await download(url, program)
  Loaders.finish('downloading', {
    symbol: '⬇️ ',
    text: `Saved to ${Utils.relativePath(outFile)}`
  })
  return outFile
}

async function setWallpaper (outFile) {
  Loaders.start('setting')
  await wallpaper.set(outFile)
  Loaders.finish('setting', {
    symbol: '👌',
    text: 'Wallpaper set successfully'
  })
}

module.exports = async function RunProgram (program) {
  // Load modules
  await config(program)
  await cache(program)
  await common(program)

  // Parse remaining options
  program.parse(process.argv)

  if (!program.args.length) {
    program.outputHelp()
    process.exit(0)
  }

  const argsHaveCommand = program.args.some(
    x => typeof x === 'object' && !!x.name
  )

  // Command will be handled by their own '.action' handler
  if (argsHaveCommand) {
    return
  }

  // Set query
  program.query = program.args.filter(x => typeof x !== 'object').join(' ')

  const url = await searchImage(program)
  const outFile = await downloadImage(url, program)
  // If --set argument is given
  if (program.set) {
    await setWallpaper(outFile)
  }
}
