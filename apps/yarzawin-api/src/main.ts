import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const globalPrefix = '/api'
  app.setGlobalPrefix(globalPrefix)
  app.use(cookieParser())
  // app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true })
  app.enableCors({ origin: true, credentials: true })

  const port = process.env.PORT!
  await app.listen(port)

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
