const { sources } = require('../sources')
const getDB = require('../db')

function isValidSource (source) {
  if (!source) {
    return true
  }
  var names = sources.map(x => x.name).join('|')
  var regex = new RegExp(`^(${names})$`, 'i')

  if (!regex.test(source)) {
    console.error(`Unknown option: '${source}'`)
    return process.exit(1)
  }
  return source
}

async function listEntries (source) {
  const db = await getDB()

  let stats
  if (typeof source !== 'string') {
    stats = await db
      .get('cache')
      .groupBy('source')
      .mapValues(v => v.length)
      .value()
  } else {
    stats = await db
      .get('cache')
      .filter({ source })
      .groupBy('source')
      .mapValues(v => v.length)
      .value()
  }

  console.dir(stats)
}

async function flushCache (source) {
  const db = await getDB()

  if (typeof source !== 'string') {
    await db.set('cache', []).write()
  } else {
    await db
      .get('cache')
      .remove({ source })
      .write()
  }
  console.log('After flush: ')
  await listEntries(source)
}

async function handleCacheAction (program) {
  const noOptions = ['flush', 'entries'].every(
    op => !Object.keys(program).includes(op)
  )

  if (noOptions) {
    return this.outputHelp()
  }

  if (program.entries) {
    await listEntries(program.entries)
  }

  if (program.flush) {
    await flushCache(program.flush)
  }
}

module.exports = async function cache (program) {
  program
    .command('cache')
    .description('manage wally cache')
    .option(
      '--flush [source]',
      'Flush the cache for one or all sources',
      isValidSource
    )
    .option(
      '--entries [source]',
      'Number of entries for one or all sources',
      isValidSource
    )
    .action(handleCacheAction)
    .on('--help', () => {
      let help = ''
      help += '\nExample:'
      help += '\n  wally cache --flush'
      help += '\n  wally cache --flush google'
      help += '\n  wally cache --entries'
      console.log(help)
    })

  return program
}
