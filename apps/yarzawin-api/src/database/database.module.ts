import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiaryEntity } from './entities/DiaryEntity'
import { DbService } from './database.service'
import { SettingEntity } from './entities/SettingEntity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
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
