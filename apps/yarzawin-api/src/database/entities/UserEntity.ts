import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { DiaryEntity } from './DiaryEntity'
import { SettingEntity } from './SettingEntity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column()
  username: string

  @Column({ name: 'display_name' })
  displayName: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @OneToMany(() => DiaryEntity, (diary) => diary.user)
  diaries: DiaryEntity[]

  @OneToMany(() => SettingEntity, (setting) => setting.user)
  settings: SettingEntity[]
}
