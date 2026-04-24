import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const createJournalSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

const updateJournalSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
})

const deleteJournalSchema = z.object({
  id: z.string(),
})

// class is required for using DTO as a type
export class CreateJournalDto extends createZodDto(createJournalSchema) {}
export class UpdateJournalDto extends createZodDto(updateJournalSchema) {}
export class DeleteJournalDto extends createZodDto(deleteJournalSchema) {}
