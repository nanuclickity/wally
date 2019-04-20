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

  // const url = await searchImage(program)
  // console.log(url)
}
