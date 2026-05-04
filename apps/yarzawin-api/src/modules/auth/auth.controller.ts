import { Body, Controller, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'
import type { Response } from 'express'
import { AuthService } from './auth.service'
import { Env } from 'src/config/env.schema'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

class LoginDto extends createZodDto(loginSchema) {}

const TOKEN_COOKIE = 'access_token'

@Controller({ path: '/auth' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService<Env, true>,
  ) {}

  @Post('/login')
  async login(@Body() props: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { username, password } = props
    const { accessToken } = await this.authService.login(username, password)
    res.cookie(TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return { accessToken }
  }
}
