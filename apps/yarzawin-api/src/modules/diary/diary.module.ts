import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/database/entities/DiaryEntity';
import { DiaryService } from './diary.service';
import { DbService } from 'src/database/database.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  controllers: [DiaryController],
  providers: [DiaryService, DbService],
})
export class DiaryModule {}
