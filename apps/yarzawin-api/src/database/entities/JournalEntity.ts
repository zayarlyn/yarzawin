import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class JournalEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;
}
