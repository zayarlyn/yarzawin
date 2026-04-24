import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntity } from './entities/JournalEntity';
import { DbService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(...args) {
        return {
          type: 'sqlite',
          database: 'database.sqlite',
          entities: [JournalEntity],
          synchronize: true,
        };
      },
    }),
  ],
  providers: [DbService],
})
export class DatabaseModule {}
