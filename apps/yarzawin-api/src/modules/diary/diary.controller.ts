import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { DiaryService } from './diary.service'
import { CreateDiaryDto, DeleteDiaryDto, UpdateDiaryDto } from './diary.dto'

@Controller({ path: '/diaries' })
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get('/')
  async getDiaries() {
    return this.diaryService.getDiaryList()
  }

  @Post('/')
  async createDiary(@Body() data: CreateDiaryDto) {
    return this.diaryService.createDiary(data)
  }

  @Put('/:id')
  async updateDiary(@Body() data: UpdateDiaryDto) {
    return this.diaryService.updateDiary(data)
  }

  @Delete('/:id')
  async deleteDiary(@Param('id') id: string) {
    return this.diaryService.deleteDiary({ id })
  }
}
