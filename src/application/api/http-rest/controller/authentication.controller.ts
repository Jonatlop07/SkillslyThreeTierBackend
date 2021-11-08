import { Controller, HttpCode, HttpException, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpAuthenticationService } from '@application/api/http-rest/authentication/http_authentication.service';
import { HttpLocalAuthenticationGuard } from '@application/api/http-rest/authentication/guard/http_local_authentication.guard';
import {
  HttpLoggedInUser,
  HttpRequestWithUser
} from '@application/api/http-rest/authentication/types/http_authentication_types';

@Controller('auth')
@ApiTags('auth')
export class AuthenticationController {
  private readonly logger: Logger = new Logger(AuthenticationController.name);

  constructor(private readonly authentication_service: HttpAuthenticationService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthenticationGuard)
  public login(@Req() request: HttpRequestWithUser): HttpLoggedInUser {
    try {
      return this.authentication_service.login(request.user);
    } catch (e) {
      this.logger.error(e.stack);
      throw new HttpException('Internal database error', HttpStatus.BAD_GATEWAY);
    }
  }
}
