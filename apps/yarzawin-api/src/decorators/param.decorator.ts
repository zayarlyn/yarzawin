import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Auth = createParamDecorator((data: keyof any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const auth = request.auth

  return data ? auth?.[data] : auth
})
