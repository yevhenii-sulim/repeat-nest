import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(request);
  if (!request.user) return null;
  if (data) {
    return request.user[data];
  }
  const { password, ...user } = request.user;
  return user;
});
