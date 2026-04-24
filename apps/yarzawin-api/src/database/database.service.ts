import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable({})
export class DbService {
  @Inject(DataSource)
  private dataSource: DataSource;

  getEm() {
    return this.dataSource.createEntityManager();
  }
}
