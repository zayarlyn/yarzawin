import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const featureSchema = z.enum(['diary', 'blog', 'note'])

const createPostSchema = z.object({
  feature: featureSchema,
  title: z.string(),
  content: z.string().optional(),
})

const updatePostSchema = z.object({
  id: z.string(),
  feature: featureSchema,
  title: z.string(),
  content: z.string().optional(),
})

// class is required for using DTO as a type
export class CreatePostDto extends createZodDto(createPostSchema) {}
export class UpdatePostDto extends createZodDto(updatePostSchema) {}
