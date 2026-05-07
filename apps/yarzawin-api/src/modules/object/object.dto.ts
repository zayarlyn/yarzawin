import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const genS3UploadUrlSchema = z.object({
  key: z.string(),
  filename: z.string(),
  userId: z.string(),
  mimeType: z.string(),
})

const genTempUploadUrlSchema = genS3UploadUrlSchema.omit({ key: true })

const genUploadUrlSchema = genS3UploadUrlSchema.omit({ key: true }).extend({
  size: z.number(),
  width: z.number(),
  height: z.number(),
  entityName: z.string(),
  entityId: z.string(),
})

// class is required for using DTO as a type
export class GenS3UploadUrlDto extends createZodDto(genS3UploadUrlSchema) {}
export class GenTempUploadUrlDto extends createZodDto(genTempUploadUrlSchema) {}
export class GenUploadUrlDto extends createZodDto(genUploadUrlSchema) {}
