import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { checkEnv, optionalEnv } from './utils/checkEnv'

async function bootstrap() {
  checkEnv([
    'DB_NAME',
    'DB_HOST',
    'DB_PORT',
    'GOOGLE_APPLICATION_CREDENTIALS',
    'URL_FRONTEND',
  ])
  optionalEnv(['MAIL_USER', 'MAIL_PASSWORD'])
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:5173', process.env.URL_FRONTEND],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
  Logger.log(`Listening on ${await app.getUrl()}`)
  Logger.verbose(`Listening on ${await app.getUrl()}/graphql`)
}
bootstrap()
