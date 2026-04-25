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

const deleteDiarySchema = z.object({
  id: z.string(),
})

// class is required for using DTO as a type
export class CreateDiaryDto extends createZodDto(createDiarySchema) {}
export class UpdateDiaryDto extends createZodDto(updateDiarySchema) {}
export class DeleteDiaryDto extends createZodDto(deleteDiarySchema) {}
