import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { UserEntity } from './UserEntity'

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

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => UserEntity, (user) => user.settings)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}
