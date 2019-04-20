module.exports = async function common (program) {
  program
    .usage('[options] [command] | <query>')
    .option('-s, --set', 'Set as wallpaper')
    .option('-u, --unsplash', 'Use unsplash')
    .option('-g, --google', 'Use google image search')

  return program
}
