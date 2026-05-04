import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { EntityManager } from 'typeorm'
import { DbService } from 'src/database/database.service'
import { UserEntity } from 'src/database/entities/UserEntity'

@Injectable()
export class AuthService {
  db: EntityManager

  constructor(
    private dbService: DbService,
    private jwtService: JwtService,
  ) {
    this.db = this.dbService.getEm()
  }

  async login(username: string, password: string) {
    const user = await this.db.findOneBy(UserEntity, { username })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException()
    }
    return { accessToken: this.jwtService.sign({ userId: user.id, username: user.username }) }
  }
}
