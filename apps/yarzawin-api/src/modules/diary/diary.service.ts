import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { DbService } from 'src/database/database.service'
import { DiaryEntity } from 'src/database/entities/DiaryEntity'
import { CreateDiaryDto, DeleteDiaryDto, UpdateDiaryDto } from './diary.dto'

@Injectable({})
export class DiaryService {
  db: EntityManager

  constructor(private dbService: DbService) {
    this.db = this.dbService.getEm()
  }

  async getDiaryList() {
    return this.db.find(DiaryEntity, {})
  }

  async createDiary(data: CreateDiaryDto) {
    return this.db.save(DiaryEntity, data)
  }

  async updateDiary(data: UpdateDiaryDto) {
    return this.db.save(DiaryEntity, data)
  }

  async deleteDiary({ id }: DeleteDiaryDto) {
    await this.db.softDelete(DiaryEntity, { id })

    return new Promise((resolve) => setTimeout(() => resolve({ id }), 1000)) // simulate delay
  }
}
