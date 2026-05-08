import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { UserEntity } from './UserEntity'

@Entity({ name: 'object' })
export class ObjectEntity extends BaseEntity {
  @Column()
  filename: string

  @Column({ name: 'mime_type' })
  mimeType: string

  @Column()
  size: number

  @Column()
  width: number

  @Column()
  height: number

  @Column({ name: 'entity_name' })
  entityName: string

  @Column({ name: 'entity_id' })
  entityId: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => UserEntity, (user) => user.objects)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}
