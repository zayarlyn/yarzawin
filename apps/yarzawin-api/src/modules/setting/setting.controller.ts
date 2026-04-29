import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { SettingService } from './setting.service'
import { SaveSettingsByFeatureDto } from './setting.dto'

@Controller({ path: '/settings' })
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get('/:feature')
  async getDiaries(@Param('feature') feature: string) {
    return this.settingService.getSettingsByFeature({ feature })
  }

  @Post('/:feature')
  async saveSettings(@Param('feature') feature: string, @Body() { valueByTypeAndName }: SaveSettingsByFeatureDto) {
    return this.settingService.saveSettingsByFeature({ feature, valueByTypeAndName })
  }
}
