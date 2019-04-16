if (!process.env.UNSPLASH_ACCESS_KEY) {
  throw new Error('Unsplash key is required')
}
