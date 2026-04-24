import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntity } from 'src/database/entities/JournalEntity';
import { JournalService } from './journal.service';
import { DbService } from 'src/database/database.service';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntity])],
  controllers: [JournalController],
  providers: [JournalService, DbService],
})
export class JournalModule {}
