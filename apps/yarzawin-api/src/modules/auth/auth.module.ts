import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DbService } from 'src/database/database.service'
import 'dotenv/config'

@Global()
@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' } })],
  controllers: [AuthController],
  providers: [AuthService, DbService],
  exports: [JwtModule],
})
export class AuthModule {}
