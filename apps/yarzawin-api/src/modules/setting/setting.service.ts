import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { DbService } from 'src/database/database.service'
import { SettingEntity } from 'src/database/entities/SettingEntity'
import { SaveSettingsByFeatureDto } from './setting.dto'

@Injectable({})
export class SettingService {
  db: EntityManager

  constructor(private dbService: DbService) {
    this.db = this.dbService.getEm()
  }

  async getSettingsByFeature({ feature, userId }: { feature: string; userId: string }) {
    return this.db.find(SettingEntity, { where: { feature, userId } })
  }

  async saveSettingsByFeature({ feature, valueByTypeAndName, userId }: SaveSettingsByFeatureDto & { userId: string }) {
    const settingRecords = Object.entries(valueByTypeAndName).reduce(
      (items, [type, valueByName]) => [
        ...items,
        ...Object.entries(valueByName).map(([name, value]) => ({
          feature,
          type,
          name,
          value,
          userId,
        })),
      ],
      [],
    )

    return this.db.upsert(SettingEntity, settingRecords, ['feature', 'type', 'name', 'userId'])
  }
}
