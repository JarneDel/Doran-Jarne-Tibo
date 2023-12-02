import { Logger } from '@nestjs/common'

export const checkEnv = (required: string[]) => {
  const missing = []
  required.forEach(env => {
    if (!process.env[env]) missing.push(env)
  })
  if (missing.length > 0) {
    Logger.error(
      'Missing environment variables. Please check the .env file in the API package of the project. Missing:',
      missing.join(', '),
    )
    Logger.log('Exiting...')
    process.exit(1)
  }
}

export const optionalEnv = (optional: string[]) => {
  const missing = []
  optional.forEach(env => {
    if (!process.env[env]) missing.push(env)
  })
  if (missing.length > 0) {
    Logger.warn(
      'Missing optional environment variables. Please check the .env file in the API package of the project. Missing: ' +
        missing.join(', '),
    )
  }
}
