import { Injectable, NotFoundException } from '@nestjs/common'
import { DbService } from 'src/database/database.service'
import { DiaryEntity } from 'src/database/entities/DiaryEntity'
import { EntityManager, FindOneOptions } from 'typeorm'
import { CreateDiaryDto, UpdateDiaryDto } from './diary.dto'

@Injectable({})
export class DiaryService {
  db: EntityManager

  constructor(private dbService: DbService) {
    this.db = this.dbService.getEm()
  }

  async getDiaryList(where: FindOneOptions<DiaryEntity>['where']) {
    return this.db.find(DiaryEntity, { where, order: { created_at: 'desc' } })
  }

  async createDiary(data: CreateDiaryDto & { userId: string }) {
    return this.db.save(DiaryEntity, data)
  }

  async updateDiary(data: UpdateDiaryDto & { userId: string }) {
    const result = await this.db.update(DiaryEntity, { id: data.id, userId: data.userId }, data)
    if (result.affected === 0) throw new NotFoundException()
    return this.db.findOneBy(DiaryEntity, { id: data.id })
  }

  async deleteDiary({ id, userId }: { id: string; userId: string }) {
    const result = await this.db.softDelete(DiaryEntity, { id, userId })
    if (result.affected === 0) throw new NotFoundException()
    return { id }
  }
}
