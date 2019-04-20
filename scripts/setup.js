const os = require('os')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs').promises
const Utils = require('../lib/utils')
const getDB = require('../lib/db')

async function getPicturesDirectory () {
  const osPicturesDir = path.join(os.homedir(), './Pictures')
  const picturesDirExists = await Utils.exists(osPicturesDir)

  if (!picturesDirExists) {
    console.log(
      chalk.yellow(
        `Could not find your pictures directory at: ${osPicturesDir}` +
          `\nplease manually set wally downloads dir by running:` +
          `\n  ${chalk.white('wally set dir <path_to_dir>')}`
      )
    )

    return undefined
  }

  const wallyDir = path.join(osPicturesDir, './Wally')
  const wallyDirExists = await Utils.exists(wallyDir)
  if (!wallyDirExists) {
    await fs.mkdir(wallyDir)
    console.log(chalk.green(`Created directory: ${wallyDir}`))
  } else {
    console.log(chalk.white(`Found wally dir at: ${wallyDir}`))
  }

  return wallyDir
}

async function setup () {
  try {
    const dir = await getPicturesDirectory()
    const dbDefaults = {
      config: {
        dir,
        unsplash_access_key: '',
        unsplash_secret_key: '',
        google_cse_api_key: '',
        google_cse_id: ''
      },
      cache: []
    }

    const db = await getDB()
    await db.defaults(dbDefaults).write()
    console.log('Setup OK')
  } catch (err) {
    console.log(chalk.red(`[SETUP_ERR] ${err.message}`))
    console.error(err)
  }
}

setup()
