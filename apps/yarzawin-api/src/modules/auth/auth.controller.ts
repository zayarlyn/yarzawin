import { Body, Controller, Post, Res } from '@nestjs/common'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'
import type { Response } from 'express'
import { AuthService } from './auth.service'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

class LoginDto extends createZodDto(loginSchema) {}

const TOKEN_COOKIE = 'access_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

@Controller({ path: '/auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() props: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { username, password } = props
    const { accessToken } = await this.authService.login(username, password)
    res.cookie(TOKEN_COOKIE, accessToken, COOKIE_OPTIONS)
    return { accessToken }
  }
}
