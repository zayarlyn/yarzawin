import { Column, Entity } from 'typeorm'
import { BaseEntity } from './BaseEntity'

// deleted_at -> archived_at
@Entity({ name: 'diary' })
export class DiaryEntity extends BaseEntity {
  @Column()
  title: string

  @Column()
  content: string
}
