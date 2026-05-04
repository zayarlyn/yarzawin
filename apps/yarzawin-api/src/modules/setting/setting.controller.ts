import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { Auth } from 'src/decorators/param.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { SaveSettingsByFeatureDto } from './setting.dto'
import { SettingService } from './setting.service'

@UseGuards(AuthGuard)
@Controller({ path: '/settings' })
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get('/:feature')
  async getSettings(@Param('feature') feature: string, @Auth('userId') userId: string) {
    return this.settingService.getSettingsByFeature({ feature, userId })
  }

  @Post('/:feature')
  async saveSettings(@Param('feature') feature: string, @Body() props: SaveSettingsByFeatureDto, @Auth('userId') userId: string) {
    const { valueByTypeAndName } = props
    return this.settingService.saveSettingsByFeature({ feature, valueByTypeAndName, userId })
  }
}
