const program = require('commander')
const chalk = require('chalk')
const cleanStack = require('clean-stack')
const pkg = require('../package.json')
const run = require('./program')
const Loaders = require('./loaders')

function onError (err) {
  console.log(chalk.red(cleanStack(err.stack)))
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

async function main () {
  program.version(pkg.version).description(pkg.description)
  try {
    await run(program)
  } catch (err) {
    console.log('\n')
    Loaders.stopAllLoaders()
    let _error = {
      message: err.message
    }
    if (err && err.response && err.response.data) {
      _error.response = err.response.data
      _error.url = err.config.url
    }
    console.dir(_error)
    onError(err)
  }
}

main()
