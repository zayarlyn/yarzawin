import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiaryEntity } from './entities/DiaryEntity'
import { DbService } from './database.service'
import { SettingEntity } from './entities/SetttingEntity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(...args) {
        return {
          type: 'postgres',
          database: 'yarzawin',
          username: 'yarzawin_user',
          password: 'yarzawin_pwd',
          entities: [DiaryEntity, SettingEntity],
        }
      },
    }),
  ],
  providers: [DbService],
})
export class DatabaseModule {}
