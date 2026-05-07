import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiaryEntity } from './entities/DiaryEntity'
import { DbService } from './database.service'
import { SettingEntity } from './entities/SettingEntity'
import { UserEntity } from './entities/UserEntity'
import { Env } from '../config/env.schema'
import { ObjectEntity } from './entities/ObjectEntity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          database: config.get('DB_NAME'),
          username: config.get('DB_USER'),
          password: config.get('DB_PWD'),
          entities: [DiaryEntity, SettingEntity, UserEntity, ObjectEntity],
        }
      },
    }),
  ],
  providers: [DbService],
})
export class DatabaseModule {}
