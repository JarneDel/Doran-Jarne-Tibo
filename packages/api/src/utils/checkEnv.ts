export const checkEnv = (required: string[]) => {
  const missing = []
  required.forEach(env => {
    if (!process.env[env]) missing.push(env)
  })
  if (missing.length > 0) {
    console.error(
      'Missing environment variables. Please check the .env file in the API package of the project. Missing:',
      missing.join(', '),
    )
    console.log('Exiting...')
    process.exit(1)
  }
}
