import { Module, ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiaryModule } from './modules/diary/diary.module'
import { DatabaseModule } from './database/database.module'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { SettingModule } from './modules/setting/setting.module'
import { AuthModule } from './modules/auth/auth.module'
import { envSchema } from './config/env.schema'

function validate(config: Record<string, unknown>) {
  return envSchema.parse(config)
}

export const appModuleMetadata: ModuleMetadata = {
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  imports: [ConfigModule.forRoot({ isGlobal: true, validate }), DatabaseModule, AuthModule, DiaryModule, SettingModule],
}

@Module(appModuleMetadata)
export class AppModule {}
