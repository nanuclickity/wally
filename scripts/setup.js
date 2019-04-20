const fs = require('fs')
const path = require('path')

const currentDir = process.cwd()
const ENV_FILE = path.join(currentDir, '.env')
const CACHE_FILE = path.join(currentDir, 'cache.json')

function setup () {
  if (!fs.existsSync(ENV_FILE)) {
    fs.copyFileSync(path.join(ENV_FILE, '../.env.sample'), ENV_FILE)
    console.log('created .env')
  }
  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify([]), 'utf-8')
    console.log('created cache.json')
  }
}

setup()
