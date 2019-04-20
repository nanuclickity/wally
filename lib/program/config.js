const chalk = require('chalk')
const Table = require('cli-table3')
const getDB = require('../db')

const printConfig = async () => {
  const db = await getDB()
  const config = await db.get('config').value()

  const table = new Table({
    head: ['Key', 'Value'],
    style: { 'padding-left': 0, 'padding-right': 0 }
  })

  Object.keys(config).forEach(name => {
    table.push([name, config[name]])
  })

  console.log(table.toString())
}

const printConfigKeys = async () => {
  const db = await getDB()
  const config = await db.get('config').value()

  console.dir(Object.keys(config))
}

async function handleConfigAction (name, value, program) {
  const db = await getDB()
  const keys = await db
    .get('config')
    .keys()
    .value()

  if (program.print) {
    return printConfig()
  }

  if (program.keys) {
    return printConfigKeys()
  }

  // Validate config name
  if (!keys.includes(name)) {
    console.error(`Unknown command ${name}`)
    process.exit(1)
  }

  if (value !== undefined) {
    await db.set(`config.${name}`, value).write()
  } else {
    let val = await db.get(`config.${name}`).value()
    console.log(val)
  }
}

module.exports = async function config (program) {
  program
    .command('config [name] [value]')
    .description('manage wally config')
    .option('-p, --print', 'print current config')
    .option('-k, --keys', 'print valid config keys')
    .action(handleConfigAction)
    .on('--help', () => {
      let help = ''
      help += '\nExample:'
      help +=
        '\n  wally config dir ~/Pictures/Wally  ' +
        chalk.white('// Sets wally download dir')
      help +=
        '\n  wally config dir  ' +
        chalk.white('// Get current wally download dir')
      console.log(help)
    })

  return program
}
