import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { checkEnv, optionalEnv, testEnv } from './utils/checkEnv'
import { CustomLogger } from './logger/customLogger'

async function bootstrap() {
  checkEnv(['DB_NAME', 'DB_HOST', 'DB_PORT', 'URL_FRONTEND'])
  optionalEnv(['MAIL_USER', 'MAIL_PASSWORD', 'MAIL_PROVIDER'])
  testEnv()
  const port = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  })
  // allow all cors
  app.enableCors({
    origin: true,
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port)
  Logger.log(`Listening on ${await app.getUrl()}`)
  Logger.log(`Listening on ${await app.getUrl()}/graphql`)
}

bootstrap()
