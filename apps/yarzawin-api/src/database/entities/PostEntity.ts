import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { UserEntity } from './UserEntity'

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  @Column()
  title: string

  @Column()
  content: string

  @Column({ type: 'text' })
  feature: 'diary' | 'blog' | 'note'

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}
