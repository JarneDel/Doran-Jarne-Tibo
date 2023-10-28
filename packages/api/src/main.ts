import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const DB_HOST = process.env.DB_HOST
  const DB_PORT = process.env.DB_PORT
  const DB_NAME = process.env.DB_NAME
  const googleApplicationCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!DB_HOST || !DB_PORT || !DB_NAME || !googleApplicationCredentials) {
    const missing = []
    if (!DB_HOST) missing.push('DB_HOST')
    if (!DB_PORT) missing.push('DB_PORT')
    if (!DB_NAME) missing.push('DB_NAME')
    if (!googleApplicationCredentials)
      missing.push('GOOGLE_APPLICATION_CREDENTIALS')
    console.error(
      'Missing environment variables. Please check the .env file at the root of the project. Missing:',
      missing.join(', '),
    )
    process.exit(1)
  }


  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:5173', process.env.URL_FRONTEND],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
  console.info(`Listening on ${await app.getUrl()}`)
  console.info(`Listening on ${await app.getUrl()}/graphql`)
}
bootstrap()
