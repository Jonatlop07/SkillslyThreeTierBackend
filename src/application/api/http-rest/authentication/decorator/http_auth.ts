import { applyDecorators, UseGuards } from '@nestjs/common';
import { HttpJwtAuthenticationGuard } from '@application/api/http-rest/authentication/guard/http_jwt_authentication.guard';

export const HttpAuth = (): ((...args: any) => void) => {
  return applyDecorators(UseGuards(HttpJwtAuthenticationGuard));
};
