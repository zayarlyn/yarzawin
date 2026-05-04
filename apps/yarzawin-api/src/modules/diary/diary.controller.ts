import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { DiaryService } from './diary.service'
import { CreateDiaryDto, UpdateDiaryDto } from './diary.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { Auth } from 'src/decorators/param.decorator'

@UseGuards(AuthGuard)
@Controller({ path: '/diaries' })
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get('/')
  async getDiaries(@Body('where') where: any, @Auth('userId') userId: string) {
    return this.diaryService.getDiaryList({ ...where, userId })
  }

  @Post('/')
  async createDiary(@Body() data: CreateDiaryDto, @Auth('userId') userId: string) {
    return this.diaryService.createDiary({ ...data, userId })
  }

  @Get('/:id')
  async getDiary(@Param('id') id: string, @Auth('userId') userId: string) {
    const entries = await this.diaryService.getDiaryList({ id, userId })
    return entries[0] ?? null
  }

  @Put('/:id')
  async updateDiary(@Body() data: UpdateDiaryDto, @Auth('userId') userId: string) {
    return this.diaryService.updateDiary({ ...data, userId })
  }

  @Delete('/:id')
  async deleteDiary(@Param('id') id: string, @Auth('userId') userId: string) {
    return this.diaryService.deleteDiary({ id, userId })
  }
}
