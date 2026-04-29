import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiaryEntity } from './entities/DiaryEntity'
import { DbService } from './database.service'
import { SettingEntity } from './entities/SettingEntity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(...args) {
        return {
          type: 'postgres',
          database: process.env.DB_NAME,
          username: process.env.DB_USER,
          password: process.env.DB_PWD,
          entities: [DiaryEntity, SettingEntity],
        }
      },
    }),
  ],
  providers: [DbService],
})
export class DatabaseModule {}
