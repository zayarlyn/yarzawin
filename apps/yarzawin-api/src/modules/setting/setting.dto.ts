import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const saveSettingsByFeatureSchema = z.object({
  feature: z.string(),
  valueByTypeAndName: z.record(z.string(), z.record(z.string(), z.string())),
})

// class is required for using DTO as a type
export class SaveSettingsByFeatureDto extends createZodDto(saveSettingsByFeatureSchema) {}
