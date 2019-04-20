const path = require('path')
const low = require('lowdb')

const FileAdapter = require('lowdb/adapters/FileAsync')
const dbPath = path.resolve(__dirname, '../db.json')

const adapter = new FileAdapter(dbPath)

let db

module.exports = async function getDB () {
  if (!db) {
    db = await low(adapter)
  }

  return db
}
