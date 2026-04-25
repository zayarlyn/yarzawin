import { Module, ModuleMetadata } from '@nestjs/common'
import { DiaryModule } from './modules/diary/diary.module'
import { DatabaseModule } from './database/database.module'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

export const appModuleMetadata: ModuleMetadata = {
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  imports: [DatabaseModule, DiaryModule],
}

@Module(appModuleMetadata)
export class AppModule {}
