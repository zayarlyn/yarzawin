import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { JournalService } from './journal.service'
import { CreateJournalDto, deleteJournalDto, UpdateJournalDto } from './journal.dto'

@Controller({ path: '/journals' })
export class JournalController {
  constructor(private journalService: JournalService) {}

  @Get('/')
  async getJournals() {
    return this.journalService.getJournalList()
  }

  @Post('/')
  async createJournal(@Body() data: CreateJournalDto) {
    return this.journalService.createJournal(data)
  }

  @Put('/:id')
  async updateJournal(@Body() data: UpdateJournalDto) {
    return this.journalService.updateJournal(data)
  }

  @Delete('/:id')
  async deleteJournal(@Body() data: deleteJournalDto) {
    return this.journalService.deleteJournal(data)
  }
}
