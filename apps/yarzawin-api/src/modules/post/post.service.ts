import { Injectable, NotFoundException } from '@nestjs/common'
import { DbService } from 'src/database/database.service'
import { PostEntity } from 'src/database/entities/PostEntity'
import { EntityManager, FindOneOptions } from 'typeorm'
import { CreatePostDto, UpdatePostDto } from './post.dto'

@Injectable({})
export class PostService {
  db: EntityManager

  constructor(private dbService: DbService) {
    this.db = this.dbService.getEm()
  }

  async getPostList(where: FindOneOptions<PostEntity>['where']) {
    return this.db.find(PostEntity, { where, order: { created_at: 'desc' } })
  }

  async createPost(data: CreatePostDto & { userId: string }) {
    return this.db.save(PostEntity, data)
  }

  async updatePost(data: UpdatePostDto & { userId: string }) {
    const result = await this.db.update(PostEntity, { id: data.id, userId: data.userId }, data)
    if (result.affected === 0) throw new NotFoundException()
    return this.db.findOneBy(PostEntity, { id: data.id })
  }

  async deletePost({ id, userId }: { id: string; userId: string }) {
    const result = await this.db.softDelete(PostEntity, { id, userId })
    if (result.affected === 0) throw new NotFoundException()
    return { id }
  }
}
