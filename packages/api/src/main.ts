import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { checkEnv } from './utils/checkEnv'

async function bootstrap() {

  checkEnv(['DB_NAME', 'DB_HOST', 'DB_PORT', 'GOOGLE_APPLICATION_CREDENTIALS'])
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
