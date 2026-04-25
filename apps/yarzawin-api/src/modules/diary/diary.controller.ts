import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
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
  async deleteDiary(@Body() data: DeleteDiaryDto) {
    return this.diaryService.deleteDiary(data)
  }
}
