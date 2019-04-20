const Loaders = require('../loaders')
const config = require('./config')
const common = require('./common')
const cache = require('./cache')

const search = require('../search')

async function searchImage (program) {
  Loaders.start('finding', { query: program.query })
  const imageUrl = await search(program)
  Loaders.finish('finding', {
    symbol: `📸`,
    text: 'Found image'
  })

  return imageUrl
}

module.exports = async function RunProgram (program) {
  // Load modules
  await config(program)
  await cache(program)
  await common(program)

  // Parse remaining options
  program.parse(process.argv)

  if (program.hasCompleted) {
    process.exit(0)
  }

  if (!program.args.length) {
    program.outputHelp()
    process.exit(0)
  }

  // Set query
  program.query = program.args.join(' ')

  const url = await searchImage(program)

  console.log(url)
}
