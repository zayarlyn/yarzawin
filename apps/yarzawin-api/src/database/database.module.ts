import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/DiaryEntity';
import { DbService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(...args) {
        return {
          type: 'sqlite',
          database: 'database.sqlite',
          entities: [DiaryEntity],
          synchronize: true,
        };
      },
    }),
  ],
  providers: [DbService],
})
export class DatabaseModule {}
