import { Module } from '@nestjs/common'
import { DiaryController } from './diary.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiaryEntity } from 'src/database/entities/DiaryEntity'
import { DiaryService } from './diary.service'
import { DbService } from 'src/database/database.service'
import { SettingEntity } from 'src/database/entities/SetttingEntity'

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity, SettingEntity])],
  controllers: [DiaryController],
  providers: [DiaryService, DbService],
})
export class DiaryModule {}
