import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingEntity } from 'src/database/entities/SettingEntity'
import { SettingController } from './setting.controller'
import { SettingService } from './setting.service'
import { DbService } from 'src/database/database.service'

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  providers: [DbService, SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
