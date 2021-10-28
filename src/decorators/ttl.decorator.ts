import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Ttl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ttl = parseInt(request.headers['x-ttl'], 10)

    return isNaN(ttl) ? undefined : ttl
  },
)