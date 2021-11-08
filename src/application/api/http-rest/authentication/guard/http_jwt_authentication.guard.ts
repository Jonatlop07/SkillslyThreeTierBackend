import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@application/api/http-rest/authentication/decorator/public';

@Injectable()
export class HttpJwtAuthenticationGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const is_public = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (is_public) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (err) {
        Logger.error(err);
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: info.message
      }, HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
