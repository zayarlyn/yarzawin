import { Body, Controller, Post } from '@nestjs/common'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'
import { AuthService } from './auth.service'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

class LoginDto extends createZodDto(loginSchema) {}

@Controller({ path: '/auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() props: LoginDto) {
    const { username, password } = props
    return this.authService.login(username, password)
  }
}
