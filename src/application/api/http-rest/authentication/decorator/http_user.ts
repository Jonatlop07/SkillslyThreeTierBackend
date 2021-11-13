import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequestWithUser } from '@application/api/http-rest/authentication/types/http_authentication_types';

export const HttpUser: () => any = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
