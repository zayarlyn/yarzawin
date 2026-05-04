import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DbService } from 'src/database/database.service'
import { Env } from 'src/config/env.schema'

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        return { secret: config.get('JWT_SECRET'), signOptions: { expiresIn: '7d' } }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DbService],
  exports: [JwtModule],
})
export class AuthModule {}
