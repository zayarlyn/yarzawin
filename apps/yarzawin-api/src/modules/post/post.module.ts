import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostEntity } from 'src/database/entities/PostEntity'
import { PostService } from './post.service'
import { DbService } from 'src/database/database.service'

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostService, DbService],
})
export class PostModule {}
