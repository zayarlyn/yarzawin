import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const createDiarySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

const updateDiarySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
})

// class is required for using DTO as a type
export class CreateDiaryDto extends createZodDto(createDiarySchema) {}
export class UpdateDiaryDto extends createZodDto(updateDiarySchema) {}
