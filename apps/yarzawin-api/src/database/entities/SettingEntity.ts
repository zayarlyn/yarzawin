import { Column, Entity } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity({ name: 'setting' })
export class SettingEntity extends BaseEntity {
  @Column()
  feature: string

  @Column()
  type: string

  @Column()
  name: string

  @Column({ type: 'jsonb' })
  value: string
}
