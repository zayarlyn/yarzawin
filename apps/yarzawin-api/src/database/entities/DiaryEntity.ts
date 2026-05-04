import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { UserEntity } from './UserEntity'

// deleted_at -> archived_at
@Entity({ name: 'diary' })
export class DiaryEntity extends BaseEntity {
  @Column()
  title: string

  @Column()
  content: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => UserEntity, (user) => user.diaries)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}
