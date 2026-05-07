import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ObjectService } from './object.service'
import { GenTempUploadUrlDto, GenUploadUrlDto } from './object.dto'
import { Auth } from 'src/decorators/param.decorator'
import { AuthGuard } from 'src/guards/auth.guard'

@UseGuards(AuthGuard)
@Controller({ path: '/objects' })
export class ObjectController {
  constructor(private objectService: ObjectService) {}

  @Post('/gen-temp-upload-url')
  async genTempUploadUrl(@Body() data: Omit<GenTempUploadUrlDto, 'userId'>, @Auth('userId') userId: string) {
    return this.objectService.genTempUploadUrl({ ...data, userId })
  }

  // INFO: unused
  @Post('/gen-upload-url')
  async genUploadUrl(@Body() data: Omit<GenUploadUrlDto, 'userId'>, @Auth('userId') userId: string) {
    return this.objectService.genUploadUrl({ ...data, userId })
  }
}
