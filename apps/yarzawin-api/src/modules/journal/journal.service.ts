import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { DbService } from 'src/database/database.service'
import { JournalEntity } from 'src/database/entities/JournalEntity'
import { CreateJournalDto, DeleteJournalDto, UpdateJournalDto } from './journal.dto'

@Injectable({})
export class JournalService {
  db: EntityManager

  constructor(private dbService: DbService) {
    this.db = this.dbService.getEm()
  }

  async getJournalList() {
    return this.db.find(JournalEntity, {})
  }

  async createJournal(data: CreateJournalDto) {
    const journal = this.db.create(JournalEntity, data)

    return this.db.save(JournalEntity, journal)
  }

  async updateJournal(data: UpdateJournalDto) {
    return this.db.save(JournalEntity, data)
  }

  async deleteJournal({ id }: DeleteJournalDto) {
    await this.db.softDelete(JournalEntity, { id })
    return { id }
  }
}
