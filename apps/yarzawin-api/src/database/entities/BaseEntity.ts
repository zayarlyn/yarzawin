import { BeforeInsert, BeforeUpdate, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { monotonicFactory } from 'ulid'

const ulid = monotonicFactory()

@Entity()
export class BaseEntity {
  @PrimaryColumn({ type: 'text', default: Date.now().toString() })
  id: string = ulid()

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date
}
