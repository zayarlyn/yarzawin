import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class DiaryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;
}
