module.exports = async function common (program) {
  program
    .usage('[options] [command] | <query>')
    .option('-s, --set', 'set as wallpaper')
    .option('-u, --unsplash', 'use unsplash')
    .option('-g, --google', 'use google image search')

  return program
}
