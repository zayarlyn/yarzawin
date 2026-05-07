import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ObjectEntity } from 'src/database/entities/ObjectEntity'
import { ObjectController } from './object.controller'
import { ObjectService } from './object.service'
import { DbService } from 'src/database/database.service'

@Module({
  imports: [TypeOrmModule.forFeature([ObjectEntity])],
  controllers: [ObjectController],
  providers: [ObjectService, DbService],
})
export class ObjectModule {}
