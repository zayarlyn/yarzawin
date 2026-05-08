import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { PostEntity } from './PostEntity'
import { SettingEntity } from './SettingEntity'
import { ObjectEntity } from './ObjectEntity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column()
  username: string

  @Column({ name: 'display_name' })
  displayName: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[]

  @OneToMany(() => SettingEntity, (setting) => setting.user)
  settings: SettingEntity[]

  @OneToMany(() => ObjectEntity, (object) => object.user)
  objects: ObjectEntity[]
}
