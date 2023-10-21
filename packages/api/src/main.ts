import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const DB_HOST = process.env.DB_HOST
  const DB_PORT = process.env.DB_PORT
  const DB_NAME = process.env.DB_NAME
  console.log(`DB_HOST: ${DB_HOST}`)
  console.log(`DB_PORT: ${DB_PORT}`)
  console.log(`DB_NAME: ${DB_NAME}`)
  if (!DB_HOST || !DB_PORT || !DB_NAME) {
    throw new Error('Missing DB_HOST or DB_PORT or DB_URL')
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
